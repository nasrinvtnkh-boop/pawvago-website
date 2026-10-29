# PawVago Travel + Everyday Companion

## Product architecture

**Travel Mode**
- Existing Trip Checker, airline directory, policy snapshot, route document timeline and destination service planning
- The main site can open Travel Mode from the unified companion hub.
- Airline-policy matches are **preliminary**; no real-time pet seat availability, booking or final compliance determination.

**Everyday Mode**
- Authenticated multi-pet profiles: name, species, breed, birth date, weight and owner-entered rabies-valid-until date
- Document wallet **metadata only** (type, name, issue and expiry dates; no file uploads yet)
- In-app care reminders for vaccination, medication, vet appointments, grooming, document renewals and custom items
- Preferred veterinary contacts, per pet
- Upcoming/overdue dates in the dashboard when the user returns
- Opt-in nearby pet services: select vets, emergency vets, shops, grooming, boarding or pet-friendly hotels, then request browser geolocation. Results display if the existing service-provider directory contains matching geolocated entries. Otherwise a clickable Google Maps search is offered.

**Privacy and safety**
- No browser geolocation until the user explicitly clicks **Use my location**.
- GPS coordinates are not stored by PawVago; the external Google Maps link shares approximate coordinates with Google only when the user opens it.
- No public nearby pet-owner matching or exact pet location sharing. Such a community feature must be separately opt-in, consent-based and designed with coarse location boundaries.
- Supabase tables \`pet_care_reminders\` and \`pet_vet_contacts\` enforce RLS with \`user_id\` and per-owner pet relationships; anonymous SELECT privileges revoked.
- Documents and medication records should be treated as sensitive personal content; do not expose them to public plugin tools.
- No health diagnosis or automated veterinary treatment advice.
- No automated background email, push notifications or medicine dosage suggestions. Dates are visible in-app upon revisit.

## Developer tasks before full public release

1. Verify account login / signup, multi-pet save, update, document add/remove, reminder completion, vet add/remove on the authenticated Vercel Preview, including mobile.
2. Verify RLS cannot read or edit another user's records and ensure expired account sessions are handled.
3. Replace or populate current empty service directory, or integrate a licensed commercial POI provider before monetizing nearby searches. Google Maps is currently a user-opened fallback, not an embedded map feed.
4. Provide policies/terms, privacy notice and lawful basis for data processing, retention and deletion.
5. Add user-configurable notifications with opt-in and tested delivery only after independent approval of any chargeable service. 
6. Add private document uploads only after private storage buckets, policies, limits and vulnerability review are ready.
7. Expand supported and verified route regulations to United States and additional regions before advertising worldwide coverage.
8. Keep ChatGPT plugin read-only; do not expose private care records until secure account authorization flows are implemented.
9. Validate pricing and recurring demand before enabling monthly billing.

## Fees (owner approval required)

No paid model API, payment service, external location API or platform upgrade was activated by this feature.
- Supabase/Vercel free quotas can be exceeded with user growth.
- Live provider results from a production-grade maps/places API may require a commercial plan.
- Background notifications may require paid delivery.
- AI chat on PawVago's own site will use metered model tokens once activated.
