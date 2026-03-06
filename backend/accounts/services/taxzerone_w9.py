"""
TaxZerone W-9 status integration.

Flow:
  1) Build HMAC-SHA256 signed Basic auth header (client_id + timestamp)
  2) Fetch OAuth2 token (client_credentials)
  3) Call FormW9/getw9status to check submission/completion status

All secrets must come from environment variables.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from dataclasses import dataclass
from typing import Any

import requests
from django.conf import settings


class TaxZeroneError(Exception):
    pass


def _env(name: str, default: str | None = None) -> str | None:
    val = getattr(settings, name, None)
    if val is not None:
        return str(val)
    import os
    return os.environ.get(name, default)


@dataclass
class TaxZeroneConfig:
    client_id: str
    client_secret_base64: str
    oauth_token_url: str
    api_base_url: str


class TaxZeroneW9Client:
    """
    Minimal TaxZerone client for:
      - OAuth token
      - W-9 status
    """

    def __init__(self, config: TaxZeroneConfig | None = None, timeout_s: int = 30):
        if config is None:
            env = (_env("TAXZERONE_ENV", "sandbox") or "sandbox").strip().lower()
            if env == "prod" or env == "production":
                oauth_token_url = _env("TAXZERONE_OAUTH_TOKEN_URL", "https://oauth.taxzerone.com/oauth2/token") or ""
                api_base_url = _env("TAXZERONE_API_BASE_URL", "https://api.taxzerone.com") or ""
            else:
                oauth_token_url = _env("TAXZERONE_OAUTH_TOKEN_URL", "https://oauth-sandbox.taxzerone.com/oauth2/token") or ""
                api_base_url = _env("TAXZERONE_API_BASE_URL", "https://api-sandbox.taxzerone.com") or ""

            client_id = (_env("TAXZERONE_CLIENT_ID", "") or "").strip()
            client_secret_base64 = (_env("TAXZERONE_CLIENT_SECRET_BASE64", "") or "").strip()
            config = TaxZeroneConfig(
                client_id=client_id,
                client_secret_base64=client_secret_base64,
                oauth_token_url=oauth_token_url.strip(),
                api_base_url=api_base_url.strip().rstrip("/"),
            )

        self.config = config
        self.timeout_s = int(timeout_s)
        self._cached_token: str | None = None
        self._cached_token_expires_at: float | None = None

    def _build_basic_auth_header(self) -> str:
        """
        TaxZerone requires: Basic base64("{client_id}:{signature_base64}:{timestamp}")
        where signature = HMAC-SHA256(secret_key_bytes, "{client_id}:{timestamp}")
        """
        client_id = (self.config.client_id or "").strip()
        secret_b64 = (self.config.client_secret_base64 or "").strip()
        if not client_id or not secret_b64:
            raise TaxZeroneError("TaxZerone client credentials are missing (TAXZERONE_CLIENT_ID / TAXZERONE_CLIENT_SECRET_BASE64).")

        try:
            secret_key_bytes = base64.b64decode(secret_b64)
        except Exception as e:
            raise TaxZeroneError(f"Invalid TAXZERONE_CLIENT_SECRET_BASE64 (base64 decode failed): {e}")

        timestamp = int(time.time())
        data = f"{client_id}:{timestamp}"
        signature = hmac.new(secret_key_bytes, data.encode("utf-8"), hashlib.sha256).digest()
        signature_b64 = base64.b64encode(signature).decode("utf-8")

        credentials = f"{client_id}:{signature_b64}:{timestamp}"
        auth_b64 = base64.b64encode(credentials.encode("utf-8")).decode("utf-8")
        return f"Basic {auth_b64}"

    def get_access_token(self, force_refresh: bool = False) -> str:
        # Simple in-process cache (good enough for a single gunicorn worker; safe fallback otherwise)
        now = time.time()
        if (
            not force_refresh
            and self._cached_token
            and self._cached_token_expires_at
            and now < (self._cached_token_expires_at - 30)
        ):
            return self._cached_token

        auth_header = self._build_basic_auth_header()
        url = self.config.oauth_token_url
        if not url:
            raise TaxZeroneError("Missing TAXZERONE_OAUTH_TOKEN_URL.")

        headers = {
            "Content-Type": "application/json",
            "Authorization": auth_header,
        }
        payload = {"grant_type": "client_credentials"}

        resp = requests.post(url, headers=headers, data=json.dumps(payload), timeout=self.timeout_s)
        try:
            data = resp.json()
        except Exception:
            raise TaxZeroneError(f"TaxZerone token endpoint returned non-JSON (status {resp.status_code}): {resp.text[:500]}")

        if resp.status_code >= 400:
            raise TaxZeroneError(f"TaxZerone token request failed (status {resp.status_code}): {data}")

        token = data.get("access_token")
        if not token:
            raise TaxZeroneError(f"TaxZerone token response missing access_token: {data}")

        expires_in = data.get("expires_in") or 3600
        try:
            expires_in = int(expires_in)
        except Exception:
            expires_in = 3600

        self._cached_token = token
        self._cached_token_expires_at = now + expires_in
        return token

    def get_w9_status(self, *, params: dict[str, Any] | None = None) -> dict[str, Any]:
        """
        Calls:
          GET {api_base}/v1/FormW9/getw9status

        Note: Some vendors implement this as POST. We try GET first, then fallback to POST if needed.
        """
        token = self.get_access_token()
        base = self.config.api_base_url.rstrip("/")
        url = f"{base}/v1/FormW9/getw9status"

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

        params = params or {}

        # Try GET with query params
        resp = requests.get(url, headers=headers, params=params, timeout=self.timeout_s)
        if resp.status_code in (405, 415):  # method not allowed / unsupported media type
            resp = requests.post(url, headers=headers, json=params, timeout=self.timeout_s)

        try:
            data = resp.json()
        except Exception:
            raise TaxZeroneError(f"TaxZerone getw9status returned non-JSON (status {resp.status_code}): {resp.text[:500]}")

        if resp.status_code >= 400:
            raise TaxZeroneError(f"TaxZerone getw9status failed (status {resp.status_code}): {data}")

        return data


def infer_w9_completed(status_payload: dict[str, Any]) -> bool:
    """
    Vendor responses vary. We handle common shapes:
      - { submitted: true } / { completed: true }
      - { status: "COMPLETED" } / { status_message: "Completed" }
      - nested: { data: { ... } }
    """
    if not isinstance(status_payload, dict):
        return False

    # unwrap common nesting
    data = status_payload.get("data") if isinstance(status_payload.get("data"), dict) else status_payload

    for key in ("submitted", "completed", "isSubmitted", "isCompleted"):
        val = data.get(key)
        if isinstance(val, bool):
            return val

    # status string checks
    for key in ("status", "status_message", "statusMessage", "W9Status"):
        val = data.get(key)
        if isinstance(val, str):
            norm = val.strip().upper()
            if "COMPLETE" in norm or "COMPLETED" in norm:
                return True
            if norm in {"SUBMITTED", "DONE", "FINISHED"}:
                return True

    return False

