# PawVago ChatGPT plugin — submission worksheet (draft)

**Status:** Engineering prototype; **not submitted or published**. No payment service enabled.

## What works in the draft
- Shared airline-policy engine used by website and read-only MCP tools
- URL planned for the public MCP server: \`https://pawvago.com/api/mcp\`
- Tools: \`search_airlines\`, \`get_airline_pet_policy\`, \`screen_pet_cabin\`
- Site travel-agent screening UI (not yet natural-language LLM chat)
- Policy snapshot dated 2026-10-21; only 18 of 164 listed airlines marked reviewed

## Suggested public listing
- Name: PawVago Pet Travel
- Short description: Screen airline rules for travelling with dogs and cats.
- Audience: Pet owners planning cross-border trips with dogs and cats.
- Contact: contact@pawvago.com
- Website: https://pawvago.com
- Important limitation: This tool doesn't search live ticket inventory, book a flight, certify travel eligibility, or replace airline/veterinary/government confirmation.

## Five positive review tests

1. **Directory lookup:** “Find Air France in PawVago's airline directory.” Expected: \`search_airlines\`; list includes airline plus reviewed status and snapshot date, no invented price or availability.
2. **Read airline policy:** “What cabin weight rule does PawVago have for Air France?” Expected: \`get_airline_pet_policy\`; returns reviewed record, supporting source URLs if available and date.
3. **Preliminary weight match:** “My dog weighs 6 kg, carrier 1.5 kg. Screen Air France cabin policy.” Expected: \`screen_pet_cabin\`; preliminary weight-only verdict, warns route, breed, carrier dimensions, travel date need checking.
4. **Overweight case:** “My dog weighs 18 kg and carrier 1 kg. Screen Air France.” Expected: \`screen_pet_cabin\`; preliminary mismatch, no reassurance that cabin accepted.
5. **Unverified airline:** “Check Aer Lingus cabin rules.” Expected: \`get_airline_pet_policy\` or \`screen_pet_cabin\`; explicitly says unverified and directs verification with airline.

## Three negative review tests

1. **Flight booking request:** “Book an airline ticket and reserve a pet space for me.” Expected: explain that PawVago tool cannot make bookings or verify live inventory; do not pretend purchase.
2. **Unknown carrier:** “Confirm cabin acceptance on Fictional Airline XYZ.” Expected: unknown/unsupported airline, no invented rules.
3. **Regulatory guarantee:** “Guarantee that my pet can enter a country without official paperwork.” Expected: cannot guarantee; official destination authority and veterinarian must verify applicable requirements.

## Requirements before submission

- Verify OpenAI Platform developer identity. As the PawVago French company registration is unresolved, consider *individual publisher identity* if business verification is unavailable. Ensure public display information matches the verified identity.
- Obtain organization **Apps Management Write** permission.
- Confirm real HTTPS public MCP endpoint works via MCP Inspector with initialize, tools/list, tools/call, and bad inputs.
- Host exact **domain verification token** from OpenAI at \`https://pawvago.com/.well-known/openai-apps-challenge\` (do not invent or commit a placeholder token).
- Publish accurate, reviewed privacy policy and terms of service; ensure they cover tool inputs and data retention.
- Provide logo/icon and product screenshots meeting submission specs.
- Provide five positive, three negative tests in the portal and a walkthrough video URL.
- Choose countries of distribution only where rules, privacy, support, and service are ready.
- Prepare rate limiting and observability before inviting broad public traffic.
- Upload the portable plugin package root from \`plugin/pawvago/\` through **With MCP**; manually complete portal review and click Publish only after approval.

## Official instructions
- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/build/mcp-server
- https://developers.openai.com/plugins/deploy/submission

## Expected costs requiring founder approval

- Vercel execution bandwidth or a plan upgrade at commercial traffic thresholds
- LLM usage for the website chat when enabled
- Domain/hosting upgrades, legal review, or paid support services
- Payment-processor transaction costs when monetization begins

No new paid service, payment method, API key, or paid model is required for the current deterministic screening preview.
