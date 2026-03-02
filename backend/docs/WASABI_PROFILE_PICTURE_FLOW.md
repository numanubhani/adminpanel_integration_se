# Profile picture upload flow (React → Django → Wasabi)

## End-to-end flow

1. **Frontend (React)**  
   User selects an image and submits the profile form. The app sends a **PATCH** (or PUT) to the backend with `multipart/form-data`, including the file under the field name `profile_picture`.

2. **Backend – view**  
   `update_my_profile()` in `accounts/views.py` receives the request, gets the current user’s profile, and calls:
   - `ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})`
   - `serializer.is_valid(raise_exception=True)` then `serializer.save()`.

3. **Backend – serializer**  
   `ProfileSerializer.update()` in `accounts/serializers.py`:
   - Reads `request` from `self.context['request']` (so it can see `request.FILES`).
   - If `'profile_picture' in request.FILES` and `USE_WASABI_STORAGE` is True:
     - Builds a key: `profile_pictures/{user_id}_{uuid}.{ext}`.
     - Calls **`default_storage.save(key, file)`** to upload the file to Wasabi (same path as the working `wasabi_test_upload` command).
     - Sets **`instance.profile_picture.name = saved_name`** (using the name returned by `default_storage.save()`).
   - Applies other `validated_data` and calls **`instance.save()`** to persist the profile (including the new `profile_picture` name) in the DB. No second upload is done here; the file is already in Wasabi.

4. **Backend – response**  
   The view does `profile.refresh_from_db()` and returns **`ProfileSerializer(profile, context={'request': request}).data`**.  
   The serializer’s **`get_profile_picture(obj)`** runs for the `profile_picture` field and, when using Wasabi, returns a **presigned URL** for `obj.profile_picture.name` (the key stored in the DB).

5. **Frontend**  
   The client gets the profile JSON with `profile_picture` set to that presigned URL and uses it as the `src` of an `<img>` (with `referrerPolicy="no-referrer"`). The browser issues a **GET** to the presigned URL.

6. **Wasabi**  
   Wasabi receives the GET for the object at `see-media` / `profile_pictures/{user_id}_{uuid}.png`. If the object exists, it returns the image; otherwise you get **404 Not Found**.

## Why you can get 404

- The presigned URL is correct (bucket `see-media`, key e.g. `profile_pictures/59_aa26b64f....png`), but the **object was never uploaded** to that key (or was uploaded to another bucket/key).
- Typical causes:
  1. **Wrong bucket in `.env`**  
     Backend must use the same bucket for upload and for presigning. If uploads go to e.g. `se-media` but presigning uses `see-media`, the object won’t be found at the URL the frontend uses.  
     Fix: set **`WASABI_BUCKET_NAME=see-media`** in `backend/.env` (same as in the Wasabi console) and restart Django.
  2. **Upload failing without surfacing**  
     If `default_storage.save()` fails after we set the name (e.g. network/credentials), the DB would still have the key and we’d return a presigned URL for an object that doesn’t exist.  
     Check Django logs for `Wasabi upload: default_storage.save returned name=...` and any exception or `Wasabi 404: profile_picture not found after save`.
  3. **Different credentials**  
     The access key used for **upload** (from `backend/.env`) must have **PutObject** on the bucket; the same key is used for **presigning** (GetObject). If upload uses another key or no key, the file may not be in the bucket you’re presigning for.

## Quick checks

- In **Wasabi console**: bucket name is exactly **`see-media`** (same as in the URL).
- In **`backend/.env`**: **`WASABI_BUCKET_NAME=see-media`** (no typo, no extra space).
- After an upload, check **Django logs** for:
  - `Wasabi upload: saving profile_picture key=... bucket=see-media ...`
  - `Wasabi upload: default_storage.save returned name=...`
  - Absence of `Wasabi 404: profile_picture not found after save` (if you see it, the object was not found right after save).
