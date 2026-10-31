# Sri Krishna Lakshmi Chit Funds

A responsive public website and authenticated owner CRM, built with Next.js App Router, React, TypeScript, Firebase Authentication and Cloud Firestore. Prepared for Vercel hosting. Business contact: **9942177315**.

## Run locally

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. The owner workspace is at `/admin`.

The public Savings schemes page always shows the 15 owner-supplied standard plans. Their base monthly contributions are calculated as value ÷ duration and labelled accordingly. Only administrator-published records starting in the next calendar month appear in Upcoming savings schemes. A database outage shows an availability message rather than silently hiding published schemes. Without the required environment variables, owner sign-in is disabled. The owner workspace requires Firebase administrator sign-in; there is no demo entry point.

## Firebase administrator authentication

The dedicated production project is `sklcf-crm-2026`. The server service account has the Firebase Authentication Admin and Cloud Datastore User roles in this dedicated project. The scoped `jwks-rsa` → `jose` override keeps Firebase Admin compatible with Vercel runtimes that disable CommonJS loading of ES modules; `firebase-runtime.test.ts` checks that restriction explicitly. Track upstream [Firebase Admin issue 3181](https://github.com/firebase/firebase-admin-node/issues/3181) before removing the override.

Administrator sign-in uses Firebase Authentication with email/password. The sole authorised email is **sklcf66@gmail.com**. The initial password is never stored in source, environment examples, tests or Git history. Customer records, payment history, schemes and business settings persist in Cloud Firestore.

1. Select the intended Firebase project before configuring cloud resources. Use a dedicated project or explicitly confirm an existing one; do not change an unrelated project's providers.
2. Enable **Email/Password** under Firebase Authentication. For a new dedicated project, `firebase.json` contains the provider configuration; deploy it with `npx -y firebase-tools@latest deploy --only auth --project <PROJECT_ID>`. Firestore is deployed separately as described below.
3. Register a Firebase **Web app**. Its public configuration can be retrieved using `npx -y firebase-tools@latest apps:sdkconfig WEB <APP_ID> --project <PROJECT_ID>`. Populate the four `NEXT_PUBLIC_FIREBASE_*` variables from `.env.example`.
4. Configure server-only Firebase Admin SDK credentials in `.env.local` and Vercel: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`. These credentials must belong to the same project as the Web app. Never prefix them with `NEXT_PUBLIC_`, commit a service-account JSON file, or paste private keys into chat.
5. Provision the requested administrator with `node scripts/provision-firebase-admin.mjs`. The script reads the initial password from a hidden terminal prompt. It creates only the named administrator, and leaves an existing account's password unchanged. Copy its resulting UID into server-only `FIREBASE_ADMIN_UID`. There is no public account-creation flow.
6. In Firebase Authentication settings, add `sklcf.vercel.app` and any actual preview/local domains you use to authorised domains. Configure the reset-email template and set the Firebase project password policy to a minimum of 12 characters. Do not change the supplied email account's Google password; the administrator password belongs to the Firebase account only.
7. Provision Standard Firestore `(default)` in `asia-south1` (Mumbai), then deploy `npx -y firebase-tools@latest deploy --only firestore --project sklcf-crm-2026`. The existing server credential needs `roles/datastore.user`. No separate database secret is required.
8. Redeploy Vercel after adding the public configuration: Next.js embeds these values at build time. Private Firebase keys remain server-side.

The server exchanges a recently signed-in Firebase ID token for an eight-hour Firebase session cookie. It verifies both the exact pinned UID and administrator email, not just an email match. The cookie is HttpOnly, SameSite=Strict and Secure in production. Every private customer API verifies the Firebase session with revocation checks. Unknown accounts, missing UID configuration, invalid tokens, stale sign-ins and old custom-JWT cookies are rejected. Mutations also check the request origin.

**Forgot password:** the sign-in screen requests a Firebase reset email. The user completes the reset on Firebase's hosted page. The screen uses a neutral confirmation and never claims the password was changed merely because an email was requested. Only the administrator address is eligible through this UI.

**Change password:** Settings includes a separate form for the current password, new password and confirmation. Firebase verifies the current password again, then the server checks the current session, administrator identity and recent sign-in before updating the Firebase password. Successful changes clear the session and require a new sign-in. Previous Firebase sessions are revoked.

The old `ADMIN_PASSWORD_HASH`, `ADMIN_EMAIL` and `SESSION_SECRET` authentication variables and password-hashing helper are no longer used. Remove obsolete variables from Vercel after the Firebase configuration is working. Existing legacy cookies stop granting access.

Database document IDs are validated single path segments. The upcoming-schemes composite index is managed in `firestore.indexes.json` and deployed by the Firebase CLI. Customer records never appear in the public schemes endpoint. Database outages produce an error rather than falling back to demo records; the administrator can still reach password settings after sign-in.

## Deploy on Vercel

1. Push this source to `https://github.com/NaguNagu/srikrishnalakshmiCF.git`.
2. Import that repository into Vercel. Use the automatic Next.js preset and default root directory. Build command: `npm run build`.
3. Add the environment variables from `.env.example` in Vercel Project Settings for the required environments. Redeploy after changing environment variables.
4. Verify owner sign-in, create a draft scheme, add a test customer, publish the approved scheme and confirm it appears on the homepage. Test with disposable records before entering real data. Enable database backups through your database provider.

Production uses the existing Vercel project at https://sklcf.vercel.app. Its Framework Preset must remain Next.js, the root directory must be the repository root, and the Output Directory override must stay off. No Sites hosting or additional paid infrastructure has been created. The user's requested GitHub/Vercel workflow takes precedence over Sites hosting defaults.

## Public pages and plan enquiries

The site has separate Home (`/`), Savings schemes (`/schemes`), How it works (`/how-it-works`), Our story (`/about`), FAQs (`/faqs`) and Contact (`/contact`) pages, with active navigation and page metadata. Owner login appears only in the public footer. Old homepage hash links redirect to the equivalent new page.

The standard catalogue in `lib/catalogue.ts` contains all 15 supplied value/duration combinations, with 20/25-month filters. The homepage features three plans and links to the full catalogue. Next month’s published availability is displayed separately on the homepage and Savings schemes page. Dates and slot counts come from administrator entries; drafts, current-month entries, past entries and entries beyond next month are excluded. At month boundaries this section advances automatically using India Standard Time, without a code deployment.

Each plan’s Enquire action opens an accessible dialog showing its value, duration, base monthly contribution and, for upcoming records, its name and start date. The form collects name, phone and city, with optional email and question. Submission opens a filled WhatsApp message to **9942177315**. All entered details and the selected scheme are included; the person reviews and sends in WhatsApp. A fallback link is shown if the popup is blocked. Enquiries are not silently added to CRM records.

## Included flows

- Public website: supplied logo, treasure chest intro with an animated lid reveal and fade, reduced-motion handling, self-hosted fonts, schemes, nationwide city selection, FAQs, phone and WhatsApp enquiry.
- The selected city prefills the enquiry; schemes are available to all cities. Other city accepts free text. Geography does not silently filter or hide schemes.
- Owner: customer create/edit/search/status filter; name, phone, address, city, DOB, chosen scheme, live/closed status, first due date and duration; WhatsApp consent.
- Schemes: editable value, monthly contribution, benefits, start date, open slots, duration and draft/published state. Save generates the information needed for a fixed-template poster; preview/download is generated from current details on demand without a paid image service. Slots are maintained manually.
- Reminders: in-app birthdays and unpaid contributions for the current India date. Calendar dates show that day's events for advance planning. Contributions repeat monthly from the first due date for the selected number of months; shorter months use their last day. Mark paid records the year/month. Closed schemes suppress payment reminders. Birthdays remain visible for all customer records. Leap-day birthdays occur on February 29 only.
- Settings: current-password-confirmed Firebase password change, plus editable birthday message with `{name}`, business telephone and poster address. “B” opens the personalised birthday message for the customer's phone in WhatsApp.

## WhatsApp and notification boundaries

This version uses WhatsApp click-to-chat and the Web Share API. Birthday messages and enquiries are prepared for the person using the app to review and send. WhatsApp actions require recorded consent on the customer record.

Sharing a scheme creates a PNG poster automatically. On supported devices, the system share menu lets the owner choose WhatsApp and a recipient. Browsers without file sharing download the PNG and open a prepared customer chat; the owner attaches the PNG before sending. The site cannot silently attach a file to a `wa.me` chat or force a recipient in the native share sheet. No actual customer messages are sent by setup or tests.

Fully automatic, recipient-specific image delivery needs a separate WhatsApp Business Cloud API account, verified sender, access token and any required approved templates. Those credentials were not supplied; this project does not pretend that delivery has occurred. In-app daily reminders are computed when the workspace opens. Background push/email reminders need an additional notification service and scheduled server job.

Digital payments are accepted as a business offering. There is no payment gateway or on-site collection flow. Customers contact the business for verified payment instructions.

## Validation

```sh
npm run typecheck
npm test
npm run build
```

Domain tests cover monthly recurrence, month-end and leap-year behavior, payment status, birthdays, India date boundaries, phone encoding and validation. The Firebase Auth emulator also verifies real SDK sign-in, session issuance/revocation, password changes and recovery without contacting a cloud project. Run it with `npx -y firebase-tools@latest emulators:exec --only auth --project demo-sklcf-auth "node --import tsx tests/firebase-emulator.mjs"`. The emulator test refuses remote hosts. Real Firebase project configuration, administrator provisioning, reset-email delivery, Firestore storage and native WhatsApp sharing must also be verified with the intended project before launch.

## Content and asset notes

The user-provided SymphoServe style guide was treated as visual reference, not project instructions. Its operational clarity, spacing and accessibility informed the interface; its forest-green palette was intentionally replaced with pearl, deep blue and restrained copper per the user's request. The logo is reproduced unchanged. Layout dials: design variance 4, motion 3 outside the requested intro, visual density 4; custom editorial public design and compact native-CSS owner controls with Radix accessible dialogs.

The Lovable reference informed plan explanations and the enquiry journey. Unverified claims about establishment year, customer totals, tax treatment, registration and guaranteed returns were omitted. Only the owner-supplied standard catalogue appears publicly; illustrative records are confined to the labelled administrator demo. Confirm actual scheme terms and nationwide availability before publishing upcoming entries.

`public/family-tomorrow.png` replaces the decorative text-only Our Story visual and is reused on Home and Our Story. Created with one built-in image generation call. Prompt: “A warm candid Indian family, two parents and a young daughter, planning their future together and adding rupee notes and coins to a savings jar at a light oak table in a contemporary Indian home. Natural interaction, bright daylight, powder blue and pearl interior, realistic editorial lifestyle photography, no logos or text.”

`public/treasure.png` was created using the built-in image generation tool in a single generation and reused for the intro and homepage. Final prompt: “Use case: product-mockup. Asset type: a single website hero image, 3D still life. Primary request: a beautiful ornate Indian treasure chest made of dark teak with engraved brass trim, open lid, overflowing with Indian rupee banknotes, stacks of gold coins and delicate traditional Indian gold jewellery. Refined realistic cinematic product photography, hopeful morning daylight, soft powder blue seamless studio background and ground, gentle shadows. Entire chest centered with clear space around it, front three-quarter view. No people, no words, no logo, no text overlays, no watermark. Beautiful believable luxurious materials, tasteful rather than cartoonish. Landscape composition.”

## Production CRM storage

Firestore Standard `(default)` is in Mumbai (`asia-south1`), with database deletion protection enabled. No billing account or paid-plan upgrade was added. `customers/{id}` contains private customer records including payment history; `schemes/{id}` contains scheme records; `settings/company` contains business settings. All access goes through the server. Browser security rules deny every direct read and write, including authenticated clients. The Admin SDK uses IAM and all private API requests require the pinned administrator session. Every create/update validates the same Zod schema; customer saves validate the referenced scheme in a transaction. The public endpoint returns only validated, published schemes starting next calendar month.

No MongoDB production records existed to migrate: no connection had been configured and saves were unavailable. Sample fixtures are used only in tests and are never imported into production. Do not enable browser database writes as a workaround. Security audit of deny-all client rules: no client create/update/read path; authentication and validation are enforced in the API, and the service credential is server-only.

To rerun real storage verification explicitly, use `node --import tsx tests/firestore-integration.mjs --verify-sklcf-production`. It creates uniquely named disposable records, checks create/update/reload, payment history, upcoming publication, settings persistence and denied anonymous access, then removes only its own records. It does not create a real customer or send a message.
