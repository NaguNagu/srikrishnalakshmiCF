# Sri Krishna Lakshmi Chit Funds

A responsive public website and authenticated owner CRM, built with Next.js App Router, React, TypeScript and MongoDB. Prepared for Vercel hosting. Business contact: **9942177315**.

## Run locally

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. The owner workspace is at `/admin`.

The public Savings schemes page always shows the 15 owner-supplied standard plans. Their base monthly contributions are calculated as value ÷ duration and labelled accordingly. Only administrator-published records starting in the next calendar month appear in Upcoming savings schemes. Without a database connection, that section shows a clear empty state. Without the required environment variables, owner sign-in is disabled. A separate demo workspace uses **sample records in sessionStorage in the current browser tab**. Never enter real customer information in demo mode. Demo edits do not affect the public website or a database.

## Enable the real owner workspace

1. Create a MongoDB Atlas database (or use an existing MongoDB deployment). Create a dedicated database user with read/write access to this application's database. Allow connections from the hosting environment.
2. Copy `.env.example` to `.env.local` for local development. Set `MONGODB_URI`, `MONGODB_DB`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `SESSION_SECRET`.
3. Generate the password hash with `node scripts/hash-password.mjs 'a-long-unique-password'`. Use at least 12 characters. The result is a salted scrypt hash. Keep the password private.
4. Generate a session secret with `openssl rand -base64 48`. Use at least 32 characters. Never commit secrets.
5. Restart the development server or redeploy. Sign in with the configured email and password. No public administrator registration exists.
6. Add the complete office address and birthday template in Settings. The supplied location is Pollachi, Tamil Nadu; no street address has been invented.
7. Create and publish upcoming schemes with their actual start dates and slots. These appear only in the Upcoming section for the next calendar month in India Standard Time. The 15 standard catalogue plans have no invented start dates or slot counts. Customer records require an existing administrator-created scheme.

Database indexes are created on first use, including unique record IDs and a TTL index for login rate-limit records. The database user needs index creation permission. Owner sessions use signed JWTs in HttpOnly, SameSite=Strict cookies, secure on production. All customer-data endpoints check the session; mutations check the request origin and validate data with Zod. Login attempts are rate limited in MongoDB. Customer records never appear in the public schemes endpoint. Database outages produce an error, rather than falling back to demo records.

## Deploy on Vercel

1. Push this source to `https://github.com/NaguNagu/srikrishnalakshmiCF.git`.
2. Import that repository into Vercel. Use the automatic Next.js preset and default root directory. Build command: `npm run build`.
3. Add the five environment variables from `.env.example` in Vercel Project Settings for the required environments. Redeploy after changing environment variables.
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

The Lovable reference informed plan explanations and the enquiry journey. Unverified claims about establishment year, customer totals, tax treatment, registration and guaranteed returns were omitted. Only the owner-supplied standard catalogue appears publicly; illustrative records are confined to the labelled administrator demo. Confirm actual scheme terms and nationwide availability before publishing upcoming entries.

`public/family-tomorrow.png` replaces the decorative text-only Our Story visual and is reused on Home and Our Story. Created with one built-in image generation call. Prompt: “A warm candid Indian family, two parents and a young daughter, planning their future together and adding rupee notes and coins to a savings jar at a light oak table in a contemporary Indian home. Natural interaction, bright daylight, powder blue and pearl interior, realistic editorial lifestyle photography, no logos or text.”

`public/treasure.png` was created using the built-in image generation tool in a single generation and reused for the intro and homepage. Final prompt: “Use case: product-mockup. Asset type: a single website hero image, 3D still life. Primary request: a beautiful ornate Indian treasure chest made of dark teak with engraved brass trim, open lid, overflowing with Indian rupee banknotes, stacks of gold coins and delicate traditional Indian gold jewellery. Refined realistic cinematic product photography, hopeful morning daylight, soft powder blue seamless studio background and ground, gentle shadows. Entire chest centered with clear space around it, front three-quarter view. No people, no words, no logo, no text overlays, no watermark. Beautiful believable luxurious materials, tasteful rather than cartoonish. Landscape composition.”
