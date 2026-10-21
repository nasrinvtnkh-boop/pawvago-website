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
