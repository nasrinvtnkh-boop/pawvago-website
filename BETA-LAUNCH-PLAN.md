# PawVago: Early-access growth launch

## Status and release gate

This feature branch adds an **email-first opt-in beta registration** flow to the existing landing page; it has **not** been merged or published yet. It uses the project's existing Supabase Auth publishable credentials, with `signInWithOtp` for new sign-ups and `auth.updateUser` for logged-in users. It does not create a custom database table, does not send marketing campaigns, and does not use service-role keys.

**Before merging:**

1. In Supabase Authentication → URL Configuration, confirm Site URL and Redirect URLs include the production domain with `?beta=confirmed` links. Configure the site's canonical origin and permitted redirect patterns. Sign-in link delivery may redirect incorrectly without this.
2. In Supabase Authentication → Providers, confirm Email / OTP login is enabled and verify transactional email capacity/provider settings. Supabase's default email delivery may have tight rate limits; move to verified SMTP before promoting widely.
3. Test: unregistered email → magic-link email arrives → clicking link verifies session → beta interest metadata in Authentication Users is true. Do not assume tested until this is completed with a consented test address.
4. Test: logged-in user beta form, invalid email, consent unchecked, offline/error case, mobile layout, existing email address, and multiple sign-up attempts; verify no duplicates.
5. Verify that `contact@pawvago.com` receives messages and that privacy information (controller/contact, purpose, retention period, deletion/withdrawal process, rights, relevant hosting) is sufficient under GDPR before real promotion. Never claim the service is already published on App Store or Google Play.
6. Ensure the website product claims about travel-policy freshness are reviewed; the page explicitly warns users to verify official rules and carrier restrictions.

## How interest is recorded

At least the following fields are stored in Supabase Auth user metadata for a verified beta opt-in:

- `pawvago_beta_interested: true`
- `pawvago_beta_consent: true`
- `pawvago_beta_registered_at: ISO date`
- `pawvago_beta_source: utm_source or website`

Email link confirmation does not prove the person intends to complete a travel plan; track verified opt-ins separately from real activated users. Check counts using Supabase's Authentication Users admin interface, or a privileged query in the SQL Editor (never run a service-role query from the browser):

```sql
select
  email,
  email_confirmed_at,
  raw_user_meta_data ->> 'pawvago_beta_registered_at' as beta_registered_at,
  raw_user_meta_data ->> 'pawvago_beta_source' as beta_source
from auth.users
where raw_user_meta_data ->> 'pawvago_beta_interested' = 'true'
order by created_at desc;
```

**Privacy:** Export, store and handle sign-up email addresses only for beta access and testing communications that match the consent. Offer withdrawal and deletion, and do not build purchased lists or scrape group members' email addresses.

## 30-day organic validation plan (targets, not guarantees)

**Ideal testers:** France/EU-based dog and cat owners planning cross-border travel within six months, especially people assessing airline cabin eligibility, train travel or documentation. Target: 100 verified opt-ins, 20 hands-on testers, 10 structured feedback calls/messages.

**Week 1 — unblock the funnel:** Finish Supabase redirect/SMTP tests, privacy contact check and mobile QA. Announce a clearly scoped private beta. Add the approved beta link to existing Instagram/YouTube bio. Give each channel a `?utm_source=instagram` or `?utm_source=youtube` URL to attribute demand.

**Week 2 — relevant communities:** Ask moderators of pet-travel Facebook groups and expat communities in France for permission to post a non-spam tester invitation; focus on one real pain point and show the actual product. Never mass-DM members or fake user reviews. Publish a short pet travel route walkthrough, explicitly stating it is a beta preview.

**Week 3 — partner discovery:** Reach out individually to pet relocation services, travel-friendly vets, pet sitters and creators. Offer to interview interested owners and grant free beta access, with clear disclosure that the app is still in testing. Tailor requests rather than using generic bulk email.

**Week 4 — measure and iterate:** Count verified registrations and meaningful activations (pet profile created, trip plan attempted, survey completed). Ask testers what blocked them and prioritize product fixes over raw signup totals.

### Suggested outreach copy (English)

“Travelling with your dog or cat soon? We are building PawVago to make airline and country pet-travel requirements easier to understand. We're looking for a small group of pet owners to try the early version and tell us what's confusing. It's free to join; the app is still in beta. [PawVago beta link]”

### Suggested outreach copy (French)

“Vous préparez un voyage avec votre chien ou votre chat ? Nous développons PawVago pour simplifier les règles de transport et les documents de voyage des animaux. Nous recherchons des propriétaires volontaires pour tester une première version et nous faire part de leurs difficultés. Inscription gratuite, application encore en phase bêta. [Lien bêta PawVago]”

Do not distribute these outreach messages without permission from the relevant community or user's go-ahead. No payments or ads are authorized by this change.
