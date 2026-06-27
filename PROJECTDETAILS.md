# CommunityFix / PIIRS — Full Project Explanation

---

## 1. Simple Overview

CommunityFix (PIIRS — Public Issue and Information Reporting System) is a full-stack civic technology platform built to connect citizens with their local government. The core idea is simple: a citizen notices a problem in their neighborhood — a broken streetlight, a clogged drain, an unsafe road — and has no reliable way to report it and know it will actually get fixed. CommunityFix gives them that way.

But the platform goes beyond just issue reporting. Over time it expanded into a complete community engagement system that includes event organizing, volunteer management, donation collection, real-time QR-based event check-in, and automatic digital certificate generation for participants.

The platform is built with React and Vite on the frontend, Node.js and Express on the backend, MongoDB (native driver, no Mongoose) as the database, Firebase Authentication for user identity, and Stripe for payments. Everything is deployed and designed for real-world use in a Bangladeshi civic context.

---

## 2. The Problem

### What was broken before this existed

In most cities and municipalities, especially in Bangladesh, there is no structured digital channel for a citizen to report a civic issue and track what happens to it. The existing options are:

**Phone calls that go nowhere.** A citizen calls a municipal number, gets transferred between departments, and never hears back. There is no ticket, no record, no accountability.

**Manual reporting at offices.** Physically going to an office, writing a paper complaint, which gets filed and forgotten. No follow-up mechanism exists.

**Social media posts.** People post on Facebook hoping someone in authority will see it. Sometimes it works, usually it doesn't, and there is no systematic tracking.

**Zero transparency for citizens.** Even when a report is filed, the citizen has no visibility. They don't know who picked it up, what department is handling it, or if anyone even looked at it.

**No data for government.** Because there is no centralized system, administrators have no data to work with. They cannot see which neighborhoods have the most problems, which categories recur most, which staff are underperforming, or where to allocate resources next month.

**No community coordination.** Beyond individual complaints, there is no way for communities to organize around an issue — to show collective support, discuss it, or work together toward a fix.

**No structured civic volunteering.** Local governments and NGOs run cleanup drives, plantation events, and awareness campaigns but manage them through phone calls and spreadsheets. Volunteer registration, waitlists, payments, attendance, and recognition are all handled manually and inefficiently.

---

## 3. The Solution — What CommunityFix Actually Solves

### For Citizens

Citizens get a single platform where they can report any civic issue with a photo, their GPS location, and a description. The moment they submit, they get a tracking number and can follow the exact status of their report through a timeline — from submission, to staff assignment, to in-progress, to resolved.

They can see other reported issues on a map, upvote ones that matter to them, and comment to add context or ask questions. If enough people upvote an issue, it rises in visibility and priority. Premium subscribers can "boost" an issue to push it to Critical priority faster.

For events, citizens can register as volunteers or guests, pay registration fees where applicable, receive QR codes via email, and show up on event day to get checked in. After the event, if they attended, they automatically receive a digital participation certificate — a real, downloadable, verifiable PDF they can share on LinkedIn.

### For Government Staff

Staff members get a focused dashboard of issues assigned to them by their department. They can update statuses from the field on their phone, mark milestones, upload resolution photos, and close issues with notes. Their performance — resolution rate, average time, volume — is tracked automatically.

On event days, staff can open the QR scanner on their phone and check in attendees by scanning their QR code or entering their email manually.

### For Administrators

Administrators have complete visibility and control. They can see all issues, approve or reject submissions, assign them to appropriate staff, reprioritize them, and close them. They have an analytics dashboard with charts for issue volume over time, category breakdown, resolution time trends, and staff performance.

For events, administrators handle the entire lifecycle: creating the event with a multi-step form, managing the volunteer and waitlist, accepting or refunding payments, tracking donations toward a fund goal, marking attendance, and after the event generating certificates for everyone who showed up — one button click, the system handles the rest.

---

## 4. Features

### Frontend Features

**Issue Reporting and Tracking**
- Multi-step issue submission with photo upload, category selection, GPS location tagging
- Real-time status timeline from submission to resolution
- Map view of all issues in the area with filtering
- Upvoting with live count, and comment threads with replies
- Personal dashboard with stats: total issues, resolved, pending, average resolution time

**Payment and Subscription**
- Stripe-powered subscription upgrade (Basic / Premium)
- Issue boost payment to raise priority to High or Critical
- Payment history with receipts
- All payments verified server-side via Stripe session retrieval (not webhook-only)

**Event System**
- Public event listing with status, type, and search filters
- Event detail page with volunteer list, donation progress bar, reactions, and discussion
- Multi-step registration form: name, email, phone, institution, age group, skills, T-shirt size
- Stripe payment redirect for paid events
- Waitlist display with position number
- Free participation form (no login required — phone and email only)
- Donation widget with optional anonymous giving and receipt request

**QR Check-in Page (Event Day)**
- Dark-themed mobile-optimized scanner page
- Rear camera QR scan via `html5-qrcode`
- Four tabs: Scanner, Manual (email), Recent check-ins, Pending list
- Live attendance counter with auto-refresh every 15 seconds
- Breakdown line showing volunteer/guest count vs free participant count separately
- Free participants shown with distinct icon (Gift) vs initial letter
- Undo check-in with correct source collection routing (`?source=freeParticipate`)

**Certificate Pages**
- `/my-certificates` — user's earned certificates with event type color theming, download PDF, copy link, LinkedIn add
- `/verify/:certId` — public verification page anyone can use; shows full cert details if valid
- Both pages work with all three participant types (volunteer, guest, free participant)

**Admin Dashboard**
- Event management table with filters, status change dropdown, delete with confirmation
- Single event management page with five tabs: confirmed volunteers, waitlist, donations, inline edit form, spending breakdown
- Certificate admin page with generate button, live polling during generation, search, CSV export, per-cert resend
- QR scanner link from event management page

**UI and Animation**
- Dark zinc/emerald theme matching across all pages
- Lucide React icons throughout (no emoji in UI components)
- Motion/Framer Motion for page transitions and card animations
- GSAP for landing page effects
- OGL for WebGL canvas backgrounds

---

### Backend Features

**Authentication and Authorization**
- `verifyFBToken` middleware decodes Firebase ID tokens and sets `req.decoded_email`
- `optionalFBToken` for routes that work with or without login (donations, public event pages)
- Inline admin/staff check per route via `userCollection.findOne()` — no global middleware assumptions
- `res.send()` used consistently throughout (not `res.json()`)

**Issue System**
- Full CRUD on issues with ownership checks
- Upvote toggling with atomic counter updates
- Comment system with toxicity scoring and reply threading
- Timeline tracking every status change with actor, role, and timestamp
- Aggregation pipeline for issue listing with reporter info join

**Dual Toxicity Detection**
- Keyword-based (`checkToxicity.js`): custom English + Bangla word list, scoring per keyword, capped at 100%, flags at 85%
- ML-based (`@tensorflow-models/toxicity`): pre-trained model running server-side at comment submission, multi-label classification
- Both scores stored per comment for moderation

**AI Comment Summary**
- Gemini 2.5 Flash analyzes all comments and replies on demand
- Returns structured sentiment analysis: positive themes, concerns, overall mood
- `setupCommentSummaryRoute()` registered separately in `index.js`

**Event Registration System**
- Three participant types handled:
  - Volunteers and guests → `eventRegistrationCollection` with `role` field, `status: "confirmed"/"waitlisted"/"pending"`
  - Free participants → `freeParticipateCollection`, no login required
- Full capacity logic: volunteer cap vs guest cap (unlimited option), waitlist with position tracking
- Waitlist promotion: when a confirmed volunteer is removed, the next waitlisted person is automatically promoted, their waitlist position updated, and a promotion email sent
- Role switching: waitlisted volunteer can switch to guest and vice versa while waitlisted
- Atomic spot claiming on payment verification to prevent race conditions

**Payment Flows**
- Stripe Checkout sessions for: subscription (basic/premium), issue boost (normal/high), event registration, event donation
- All verified via `GET /verify-*` routes that call `stripe.checkout.sessions.retrieve()` server-side
- Auto-refund on event cancellation iterates all confirmed paid registrations and calls `stripe.refunds.create()`
- Donor thank-you email on donation verification

**Email Service**
- 9 transactional email functions via Nodemailer
- QR code embedded as inline attachment in confirmation emails using `QRCode.toBuffer()`
- Certificate PDF attached from Cloudinary URL on certificate delivery email

**QR Check-in Routes**
- `POST /events/:id/checkin` — tries `eventRegistrationCollection` first (status: "confirmed"), falls back to `freeParticipateCollection`
- `POST /events/:id/checkin/manual` — same fallback, by email
- `DELETE /events/:id/checkin/:regId?source=` — routes undo to correct collection based on `source` query param
- `GET /events/:id/checkin/stats` — merges counts and lists from both collections; only queries `freeParticipateCollection` if `event.isFreeParticipate === true`

**Certificate Generation**
- `generateCertificateHTML()` — pure function, returns full HTML with per-event-type colors (6 themes), Google Fonts, corner ornaments, Playfair Display headings, verify URL, cert ID
- `generateOneCertificate()` — renders page, calls `page.pdf()`, uploads to Cloudinary with `resource_type: "raw"`, inserts cert document, writes `certificateId` back to source collection (either `eventRegistrationCollection` or `freeParticipateCollection` based on `sourceCollection` field)
- `generateEventCertificates()` — batch loop, one shared Puppeteer browser instance, skips if cert already exists for that registration
- Route responds immediately, generation runs in background (fire-and-forget), auto-sends emails after each successful cert
- Certificate verify route is fully public, no auth required

**Stats and Analytics**
- User dashboard stats with date range filter (7d, 30d, 3m, 1y) and percentage change vs previous period
- Issues-over-time aggregation with dynamic grouping (daily for short ranges, monthly for long)
- Admin event stats with `$lookup` aggregation pulling waitlist, guest, free participant, and donation counts per event in a single query
- Certificate status route counts attended from both collections separately and returns breakdown

---

## 5. Workflow

### Issue Reporting Workflow

A citizen logs in via Firebase, opens the report form, fills in the title, category, description, uploads photos, and either enters their location manually or clicks "detect location" to use GPS. They submit. The backend inserts the issue document, creates a paired upvote document and timeline document with the same `_id`, increments the user's `issueCount`, and responds with the inserted ID. The issue starts with `status: "Pending"` and `isReviewed: false`.

A super staff member reviews unreviewed issues from their queue and approves them. This flips `isReviewed: true`, making the issue visible on the public feed.

An admin assigns the issue to a staff member by selecting from the staff list. The backend updates `assignInto` on the issue, increments the staff member's `assignIssued` count, and pushes a "assigned" entry to the issue timeline.

The assigned staff member sees the issue in their queue, goes to the site, updates the status through In-Progress → Working → Resolved. Each transition writes a timestamped entry to the timeline and updates the relevant timestamp field on the issue (`inProgressAt`, `workingAt`, `resolvedAt`). On resolution, the reporter's `solvedIssue` count goes up and the staff member's `resolvedIssued` count goes up.

The admin can then close the issue with a note, or reject it with a reason if it was inappropriate.

### Event Participation Workflow

An admin creates an event through a 5-step form: basic info, location and date, volunteer settings (capacity, fee, T-shirt, guest limit, free participation toggle), funding goal, and review. The event is saved with `status: "upcoming"`.

A citizen visits the event page, reads the details, and clicks Register. If they choose volunteer or guest, they fill in their details and submit. The backend checks capacity:

If a spot is available and there is no fee, the registration is immediately confirmed, the count on the event document is incremented, a QR token is generated, and a confirmation email with the QR is sent.

If a spot is available but there is a fee, the registration is set to `status: "pending"` and a Stripe Checkout session is created. The citizen is redirected to Stripe. After payment, the frontend calls the verify endpoint, which retrieves the session from Stripe, confirms payment, atomically increments the event's volunteer count with a capacity guard to prevent race conditions, sets the registration to `status: "confirmed"`, and sends a QR email.

If no spots are available, the registration goes to `status: "waitlisted"` with a position number, and a waitlist email is sent.

If the event has free participation enabled, a separate form (no login) collects name, email, and phone. A QR token is generated and a confirmation email with the QR is sent. These go into `freeParticipateCollection` separately.

On event day, an admin or staff member opens the QR scanner page on their phone. Attendees show their QR code from their email. The scanner checks `eventRegistrationCollection` first, then falls back to `freeParticipateCollection`. If found and not yet attended, `attended: true` and `attendedAt` are set. The scanner shows a full-screen colored overlay — green for success, amber for already checked in, red for not found.

After the event, the admin marks it as `status: "completed"`. Then from the certificate page, clicks "Generate Certificates". The backend fetches all attended records from both collections, normalizes them to a common shape with a `sourceCollection` field, and starts batch processing in the background while immediately responding to the client. One Puppeteer browser instance opens, renders each certificate as an HTML page, exports it as a PDF, uploads to Cloudinary, inserts the certificate document into MongoDB, writes the `certificateId` back to the source registration document, and sends an email with the PDF attached. The frontend polls the status endpoint every 5 seconds and shows a progress bar.

Each certificate has a unique ID like `CERT-2025-A3F9` and a public verify URL. Anyone — a school, an employer, an institution — can go to `/verify/CERT-2025-A3F9` and see the full certificate details without logging in.

### Payment and Refund Workflow

All payments go through Stripe Checkout sessions. The backend creates a session with the amount, product description, success URL, cancel URL, and metadata (registrationId, eventId, type). The citizen is redirected to Stripe's hosted page. After payment, Stripe redirects to the success URL with a `session_id` in the query string. The frontend calls the verify endpoint with this session ID. The backend retrieves the session from Stripe (`stripe.checkout.sessions.retrieve()`), checks `payment_status === "paid"`, and then performs the relevant database operations (confirm registration, update counts, record in payment collection, send email).

If an event is cancelled, the backend iterates all confirmed registrations that have a `stripeSessionId`, calls `stripe.refunds.create({ payment_intent: session.payment_intent })` for each, updates their `paymentStatus` to `"refunded"`, and does the same for any paid donations.

---

## 6. Optimizations

The system makes several deliberate performance decisions.

**Single Puppeteer browser instance for batch generation.** Opening and closing a Chromium browser for each certificate would be extremely slow. Instead, one browser is launched at the start of the batch, all certificates render as new pages within it, and the browser is closed once at the end. This makes batch generation roughly 5–10x faster than the naive approach.

**Immediate response, async background work.** Certificate generation and email sending are heavy operations. The generate endpoint responds to the client immediately ("Generating 50 certificates...") and then runs the batch in the background with `.then()` chaining. The client polls a lightweight status endpoint every 5 seconds instead of waiting on a long HTTP connection.

**Two-collection fallback for QR check-in.** Rather than storing all three participant types in one bloated collection with nullable fields, volunteers/guests and free participants are in separate collections matching their different schemas. The check-in route tries `eventRegistrationCollection` first (the common case), and only queries `freeParticipateCollection` if not found. For the stats route, the second collection is only queried at all if `event.isFreeParticipate === true`, avoiding unnecessary database round-trips for events without free participants.

**Atomic spot claiming on payment verification.** When a citizen pays for a registration, there is a gap between when they were shown "spot available" and when their payment actually completes. To prevent two people both paying for the last spot simultaneously, the verify endpoint uses `findOneAndUpdate` with a condition that only succeeds if the current count is still below the limit. If it fails (spot taken), it immediately issues a refund and moves the late arrival to the waitlist.

**MongoDB aggregation for complex admin views.** The admin events list page needs waitlist counts, guest counts, free participant counts, and donation stats for every event in a single list. Rather than making N+1 queries, a single aggregation pipeline with four `$lookup` stages fetches all this data in one database round-trip.

**Projection everywhere.** Every `.find()` call that doesn't need all fields uses `.project()` to return only the fields the response actually uses. This reduces network payload and memory usage, especially on large collections like `eventRegistrationCollection` where documents can have many fields.

**Temp file cleanup.** After Puppeteer renders a PDF to disk, it is immediately uploaded to Cloudinary and then deleted with `fs.unlinkSync()`. Temp files never accumulate on the server.

**Toxicity score storage.** Rather than re-running toxicity analysis on every read, the score is computed once at write time and stored on the comment document. The moderation dashboard just reads stored scores.

---

## 7. Future Improvements

**Job queue for certificate generation at scale.** The current fire-and-forget pattern works well for events up to a few hundred attendees. For very large events (500+), a proper job queue like BullMQ would allow certificate generation to be distributed across worker processes, retried on failure, and monitored with a dashboard.

**Push notifications.** Currently all updates are email-based or require the user to check the platform. Web push notifications or Firebase Cloud Messaging would allow real-time alerts when an issue status changes, when a waitlist spot opens, or when an event certificate is ready.

**Redis caching.** Frequently read, rarely changed data — like the public event list, issue categories, or user roles — could be cached in Redis to reduce database load. The analytics aggregations in particular are expensive and could benefit from short-term caching.

**Mobile application.** A React Native app would allow citizens to report issues and check event registrations on mobile more naturally, with native camera access, push notifications, and offline draft saving for issue reports.

**Offline QR scanner mode.** The event check-in page currently requires internet for every scan. A service worker could cache the list of valid QR tokens at the start of the event, allowing check-in to work even with poor connectivity in the field.

**Volunteer leaderboard and badge system.** Citizens who attend multiple events could earn badges ("5 events", "Plantation Specialist", etc.) and appear on a community leaderboard. This would increase repeat participation and community identity.

**AI-powered issue categorization.** When a citizen submits an issue, Gemini could automatically suggest the correct category, priority level, and even the most likely responsible department based on the description, reducing the manual review step.

**Multi-language support.** The platform serves a Bangladeshi user base. Full Bangla language support across the UI — not just toxicity detection — would significantly lower the barrier to participation for non-English-comfortable citizens.

**Certificate bulk download.** Admins can currently resend individual certificates. A ZIP download of all certificates for an event would be useful for archiving and submission to funding bodies.

**Integration with municipal databases.** In the longer term, the platform could integrate directly with city department systems so that issue assignments and status updates flow both ways — the platform becomes the citizen-facing layer on top of existing government workflows rather than a parallel system.