# W-9 / TaxZerone Integration – Briefing for Supervisor

## What is this?

We need **creators (contributors)** to submit a **W-9 tax form** before they can receive certain payments. We don’t host the form ourselves. We use **TaxZerone** (external vendor) to collect the W-9. Our system only needs to:

1. Send the creator to TaxZerone’s form.
2. Know when they’ve submitted it so we can mark them as “W-9 done” and allow payouts.

---

## Who does what?

| Who | Role |
|-----|------|
| **TaxZerone** | Hosts the W-9 form, collects the data, and notifies us when a creator submits. |
| **Our app** | Sends creators to the form (with an ID so we can match them back), and receives a “notification” (webhook) when they submit. |
| **Creator** | Fills out the W-9 on TaxZerone’s page and submits. |

---

## Flow in simple steps

1. **Creator needs to complete W-9**  
   In our app we generate a unique ID for that creator and build a link to TaxZerone’s form, e.g.:  
   `https://selectexposuretest.taxinterface.com/w9forms/?uniqueid=abc-123-...`

2. **Creator opens the link and submits the form**  
   They fill out the W-9 on TaxZerone’s site and submit. We don’t see the form or the data; TaxZerone handles that.

3. **TaxZerone notifies us**  
   When the form is submitted, TaxZerone sends a **POST request** (webhook) to a URL we gave them, e.g.:  
   `https://selectexposure.com/api/accounts/profile/w9/callback/`  
   That request includes the same unique ID (and possibly email) so we know which creator just completed the W-9.

4. **We update our database**  
   Our backend receives that POST, finds the creator by that ID (or email), and marks their profile as “W-9 completed” and stores the date. After that, we can allow payouts for that creator.

So: **we know a user submitted the W-9 when TaxZerone calls our webhook and we successfully update that creator’s W-9 status.**

---

## What we have built (our side)

- **Unique ID**  
  We can generate a W-9 unique ID per contributor (via API when they use the app, or in Django admin with the “Generate W-9 unique ID” action).

- **Form URL**  
  We build the correct TaxZerone form link (sandbox for testing, production when we go live) using settings in `.env` (`W9_FORM_BASE_URL`).

- **Webhook endpoint**  
  We have an endpoint that accepts TaxZerone’s POST when a creator submits the W-9. It:
  - Finds the creator by the ID (or by email if TaxZerone sends it).
  - Sets “W-9 completed” and completion date.
  - Saves the payload they send so we can debug or audit.

- **Django admin**  
  Supervisors can see and edit W-9 status: W-9 unique ID, W-9 completed (yes/no), W-9 completion date, and raw webhook data.

- **Logging**  
  When the webhook is called, we log it so we can see “TaxZerone just told us creator X completed the W-9.”

---

## What we gave TaxZerone (from their email)

- **Webhook URL**  
  The URL they must POST to when a creator submits the form, e.g.:  
  `https://selectexposure.com/api/accounts/profile/w9/callback/`

- **Confirmation**  
  We’re using their **sandbox** W-9 form URL for testing:  
  `https://selectexposuretest.taxinterface.com/w9forms/?uniqueid=...`  
  We will switch to the production URL when they tell us we’re on production.

---

## What is still unclear (we should confirm with TaxZerone)

1. **Who generates the unique ID?**  
   - Option A: We generate it and pass it in the form URL; they send it back in the webhook.  
   - Option B: They generate it when the creator opens the form and send it to us in the webhook (we then store it and match by email or similar).  
   We’ve built support for both; we just need them to confirm which one they use.

2. **Exact webhook payload**  
   They said the data they send to the webhook has changed and pointed to their docs. We accept common field names (`uniqueid`, `payeeRef`, `email`, etc.). If they use different names, we may need a small adjustment.

3. **Sandbox vs production**  
   We’re on sandbox now. When we go live, we’ll need their production form URL and to confirm the webhook URL (same path, different domain if needed).

---

## How we know the user submitted the W-9 and the POST was received

- **In our logs**  
  We see: “W-9 webhook received from TaxZerone” and “W-9 completed: profile user=…”.

- **In Django admin**  
  That creator’s profile shows:
  - W9 completed = Yes  
  - W9 completion date = when they submitted  
  - W9 data = copy of what TaxZerone sent (for auditing).

- **Testing**  
  We can simulate TaxZerone by sending a test POST to our webhook URL (e.g. with `curl`) and then checking logs and admin.

---

## One-sentence summary for your supervisor

**“We send creators to TaxZerone’s W-9 form with a unique ID; when they submit, TaxZerone notifies our server; we then mark that creator as W-9 complete and allow payouts. Our side is built and configured; we’re waiting on TaxZerone to confirm their webhook format and who generates the ID so we can close any gaps.”**
