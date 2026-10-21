# Policy data maintenance — PawVago

The application uses `data/pet-policy-snapshot.json` as a **manually verified policy reference**, reviewed 2026-10-21. It is **not** a live airline availability or regulatory-authority API. The landing-page journey checker and signed-in dashboard read this snapshot.

## Update procedure
1. Open the official sources in the JSON file. Confirm that the rules apply to the specific species, operating airline, route, and date.
2. Compare weight limits inclusive of carrier, carrier dimensions and exceptions; review EU/GB entry rules separately.
3. Make manual data corrections with links to primary sources. Change `reviewed_on` only when genuinely re-verified.
4. Run `node scripts/monitor-pet-policies.mjs` as an advisory check. Its string patterns detect likely changes/unavailable pages but **cannot verify legal accuracy**.
5. GitHub Actions performs a daily heuristic scan and opens one review issue on errors or likely policy drift. Do not silently auto-publish extracted legal requirements.
6. Confirm availability, route restrictions, pet acceptance and transit details directly with airlines/governments.

This architecture intentionally fails closed: when the JSON is unavailable, the journey checker does not show compatibility results. Unsupported country pairs also require official verification.

Future production integrations: licensed rules data/API, review audit trail per rule, change approval workflow, carrier operating-flight inventory and availability feed, automatic expiration gating.

## Checked hold (AVIH) and air cargo
- Airline hold rules are stored in `airlines[].hold` with `allowed`, combined pet/crate weight cap (if officially published), crate dimensions (if published), official source link, and snub-nosed restrictions.
- `cabin` and `hold` are separate airline services; `cargo` is a distinct freight shipment that requires a specialised agent and quote.
- For airlines with no verified hold weight maximum, show 'confirm with airline' rather than assuming cabin or generic limits.
- The journey checker takes a breed / short-nosed flag and does **not** grant flight clearance for pets or IATA approval for any crate.
- Refresh data only after manual source verification; the monitoring script checks hold sources heuristically and opens review issues on drift.

## Global airline directory (current release)
- Catalogue currently contains **164 selected airlines**, with **18 official-source policy references**; it is **not** a comprehensive inventory of every airline in the world.
- Browse all listings in the public airline directory with filters for name/IATA code, region, and review status. Unreviewed carriers always display 'Policy not yet verified'.
- The passenger trip checker includes all catalogue names, but never evaluates pet or kennel eligibility for an unreviewed airline.
- Signed-in dashboard screens only source-reviewed carriers to avoid creating hundreds of unverified recommendation cards.
- Add future airlines and source URLs only after checking operator identity and official policy. A valid carrier name or IATA code alone is not proof that airline transports pets.
