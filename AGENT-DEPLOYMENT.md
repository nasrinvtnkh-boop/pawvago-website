# PawVago dual-channel travel agent — preview

This is a **draft implementation**, not a production-ready autonomous AI agent or published ChatGPT plugin.

## Two delivery channels, one policy engine

- Website: The “AI Travel Agent · Policy Preview” section sends a request to \`POST /api/agent\` and displays a **preliminary airline cabin policy screen**.
- ChatGPT: A read-only MCP server is wired at \`https://pawvago.com/api/mcp\` and offers \`search_airlines\`, \`get_airline_pet_policy\`, and \`screen_pet_cabin\` tools. The ChatGPT host provides natural-language chat; these tools return structured policy data.
- Shared source of truth: \`lib/pawvago-policy.cjs\` reads \`data/pet-policy-snapshot.json\` (last reviewed 2026-10-21). Only explicitly reviewed entries produce preliminary rule matches; unreviewed entries return “needs-verification.”

**Do not describe this as live airline availability, a flight reservation, guaranteed eligibility, regulatory clearance, or completed AI-agent publication.**

## Test before merging

1. Deploy this draft to an isolated Vercel Preview environment (only after checking build/usage limits).
2. Run \`npm install\` and verify the \`@modelcontextprotocol/sdk\` package initializes in the target Node runtime.
3. POST \`/api/agent\` for a reviewed airline, an unreviewed airline, an unknown airline, invalid weights, and a missing airline.
4. Use MCP Inspector against \`/api/mcp\`: initialize; tools/list; tools/call; invalid input; GET and OPTIONS.
5. Review site responsiveness, accessibility, and multilingual text; test compatibility with existing journey checker.
6. Verify domain control and HTTPS endpoint before connecting ChatGPT developer mode.
7. Add rate limiting/monitoring, privacy policy, terms, support page and secure auth before any user-profile or paid features.
8. **Do not merge** until staging is tested and production infrastructure usage confirmed.

## Publishing in ChatGPT

Official documentation:
- https://developers.openai.com/plugins/build/mcp-server
- https://developers.openai.com/plugins/deploy/submission

Public directory publication is **not automatic**: verify developer identity, prepare plugin package manifest and icons, connect/verify the remote MCP domain, test tool behavior, provide positive/negative review cases and a walkthrough video, then submit for review and publish only after approval.

## Revenue / potential expenses — inform the founder before any payment

| Category | In this draft | Future cost |
| --- | --- | --- |
| GitHub code and deterministic policy checks | No API payments needed | Possible hosting/CI resource charges depending on plan |
| ChatGPT tool calls | Read-only; no model charged by PawVago's backend | Hosting traffic and future API usage |
| Generative AI on the PawVago website | **Not enabled** | Model/API tokens normally usage-billed; authorization and spend limit needed before enabling |
| Vercel / Supabase | Existing project reused; no subscription upgraded | Upgrade or overage may apply at higher traffic |
| Paid subscriptions / payments | Not implemented | Payment processor and billing fees |
| Trademark | Unrelated to building this prototype | Separate application fees |

No payment account, paid API key, billing plan, domain purchase, or production deployment is created by this draft PR.

## Known limitations

- 164 listed airlines, only 18 reviewed as of the 2026-10-21 snapshot. This is **not worldwide coverage**.
- No live flight schedules, pet capacity/availability, vet certificate verification, transit document verification, booking or user account bridge between website and ChatGPT.
- Website preview is a deterministic screening tool, not a general conversational LLM. The ChatGPT plugin becomes conversational through the ChatGPT host after connection.
- User-specific records would require securely scoped authorization; do not add account access to the public MCP endpoint.
