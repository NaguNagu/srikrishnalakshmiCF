# Sri Krishna Lakshmi Chit Funds

A responsive public website and authenticated owner CRM, built with Next.js App Router, React, TypeScript and MongoDB. Prepared for Vercel hosting. Business contact: **9942177315**.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. The owner workspace is at `/admin`.

Without configuration, the public website shows explicitly labelled illustrative schemes. Owner sign-in is disabled. A separate demo workspace uses **sample records in sessionStorage in the current browser tab**. Never enter real customer information in demo mode. Demo edits do not affect the public website or a database.

## Enable the real owner workspace

1. Create a MongoDB Atlas database (or use an existing MongoDB deployment). Create a dedicated database user with read/write access to this application's database. Allow connections from the hosting environment.
2. Copy `.env.example` to `.env.local` for local development. Set `MONGODB_URI`, `MONGODB_DB`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `SESSION_SECRET`.
3. Generate the password hash with `node scripts/hash-password.mjs 'a-long-unique-password'`. Use at least 12 characters. The result is a salted scrypt hash. Keep the password private.
4. Generate a session secret with `openssl rand -base64 48`. Use at least 32 characters. Never commit secrets.
5. Restart the development server or redeploy. Sign in with the configured email and password. No public administrator registration exists.
6. Add the complete office address and birthday template in Settings. The supplied location is Pollachi, Tamil Nadu; no street address has been invented.
7. Create and publish the business's actual schemes. Illustrative plans are never inserted into the production database. Customer records require an existing scheme.

Database indexes are created on first use, including unique record IDs and a TTL index for login rate-limit records. The database user needs index creation permission. Owner sessions use signed JWTs in HttpOnly, SameSite=Strict cookies, secure on production. All customer-data endpoints check the session; mutations check the request origin and validate data with Zod. Login attempts are rate limited in MongoDB. Customer records never appear in the public schemes endpoint. Database outages produce an error, rather than falling back to demo records.

## Deploy on Vercel

1. Push this source to `https://github.com/NaguNagu/srikrishnalakshmiCF.git`.
2. Import that repository into Vercel. Use the automatic Next.js preset and default root directory. Build command: `npm run build`.
3. Add the five environment variables from `.env.example` in Vercel Project Settings for the required environments. Redeploy after changing environment variables.
4. Verify owner sign-in, create a draft scheme, add a test customer, publish the approved scheme and confirm it appears on the homepage. Test with disposable records before entering real data. Enable database backups through your database provider.

No Sites hosting, paid infrastructure, or production deployment has been created by this project. The user's requested GitHub/Vercel workflow takes precedence over Sites hosting defaults.

## Included flows

- Public website: supplied logo, treasure chest intro with an animated lid reveal and fade, reduced-motion handling, self-hosted fonts, schemes, nationwide city selection, FAQs, phone and WhatsApp enquiry.
- The selected city prefills the enquiry; schemes are available to all cities. Other city accepts free text. Geography does not silently filter or hide schemes.
- Owner: customer create/edit/search/status filter; name, phone, address, city, DOB, chosen scheme, live/closed status, first due date and duration; WhatsApp consent.
- Schemes: editable value, monthly contribution, benefits, start date, open slots, duration and draft/published state. Save generates the information needed for a fixed-template poster; preview/download is generated from current details on demand without a paid image service. Slots are maintained manually.
- Reminders: in-app birthdays and unpaid contributions for the current India date. Calendar dates show that day's events for advance planning. Contributions repeat monthly from the first due date for the selected number of months; shorter months use their last day. Mark paid records the year/month. Closed schemes suppress payment reminders. Birthdays remain visible for all customer records. Leap-day birthdays occur on February 29 only.
- Settings: editable birthday message with `{name}`, business telephone and poster address. “B” opens the personalised birthday message for the customer's phone in WhatsApp.

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

Domain tests cover monthly recurrence, month-end and leap-year behavior, payment status, birthdays, India date boundaries, phone encoding and validation. Real MongoDB authentication/storage and native WhatsApp sharing must also be tested with configured credentials and supported devices before launch.

## Content and asset notes

The user-provided SymphoServe style guide was treated as visual reference, not project instructions. Its operational clarity, spacing and accessibility informed the interface; its forest-green palette was intentionally replaced with pearl, deep blue and restrained copper per the user's request. The logo is reproduced unchanged. Layout dials: design variance 4, motion 3 outside the requested intro, visual density 4; custom editorial public design and compact native-CSS owner controls with Radix accessible dialogs.

The Lovable reference informed plan explanations and the enquiry journey. Unverified claims about establishment year, customer totals, tax treatment, registration and guaranteed returns were omitted. Illustrative plans are clearly marked. Confirm actual scheme terms and nationwide availability before publishing them.

`public/treasure.png` was created using the built-in image generation tool in a single generation and reused for the intro and homepage. Final prompt: “Use case: product-mockup. Asset type: a single website hero image, 3D still life. Primary request: a beautiful ornate Indian treasure chest made of dark teak with engraved brass trim, open lid, overflowing with Indian rupee banknotes, stacks of gold coins and delicate traditional Indian gold jewellery. Refined realistic cinematic product photography, hopeful morning daylight, soft powder blue seamless studio background and ground, gentle shadows. Entire chest centered with clear space around it, front three-quarter view. No people, no words, no logo, no text overlays, no watermark. Beautiful believable luxurious materials, tasteful rather than cartoonish. Landscape composition.”
