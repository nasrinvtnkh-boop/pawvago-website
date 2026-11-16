# PawVago policy maintenance and scheduled monitoring

The journey checker and dashboard use `data/pet-policy-snapshot.json`. Each reviewed airline has its own source and `reviewed_on`. Published rules are separate from live pet-space availability, flight operation and veterinary/border clearance.

## Scheduled pipeline

`.github/workflows/policy-monitor.yml` runs daily at 06:27 UTC, manually, and when monitor code changes on `main`. GitHub's scheduler may run late. Check the recorded run timestamp rather than assuming a check happened at the scheduled time.

1. Collect all recorded cabin, hold, breed, additional-source and government URLs. Deduplicate them. Report catalogue entries without source URLs explicitly; those entries are not monitored.
2. Fetch HTML/PDF sources with time, size and concurrency limits. Detect common bot/JavaScript walls. Extract PDF text with Poppler. An inaccessible source is an error, never an unchanged/verified policy.
3. Compare normalized content hashes and numerical signals against the stored observation baseline. A first observation creates a baseline only, not a verified rule. Changed pages stay in the review queue. Successful retrieval never updates `reviewed_on`.
4. On readable changed pages, request at most three advisory OpenAI analyses per run through the private Vercel endpoint. There is one initial authenticated API probe using a readable Austrian source. Failures stay visible and are retried by a subsequent run. No workflow contains or copies the OpenAI key.
5. Save source-observation state in the GitHub Actions cache and JSON/Markdown reports as 30-day workflow artifacts. Cache loss establishes new baselines and must not be interpreted as continued policy validity.
6. Update one public repository review-queue issue with failed/changed source URLs and short advisory summaries. The report contains no credentials or full source-page copies. GitHub job summaries provide execution and coverage counts.

## API boundary and cost controls

`api/policy-monitor-analysis.mjs` authenticates GitHub Actions OIDC JWTs against GitHub's signing keys. It accepts only the fixed PawVago repository and owner IDs, `main`, the exact monitor workflow, and push/schedule/manual events. Other callers receive 401 before any paid call.

The OpenAI key remains in Vercel's `OPENAI_API_KEY` environment variable. Model selection is `POLICY_MONITOR_MODEL`, then `OPENAI_MODEL`, then the existing small-model fallback `gpt-4o-mini`. Requests are bounded to 20,000 source characters, 6,000 reference characters and 1,000 output tokens, with at most three workflow requests per run. A new subscription or transfer of the key to GitHub is not required. Actual API access/billing must succeed in an authenticated run before reporting API analysis as working.

Source text is untrusted data. The model has no tools and cannot publish rules. Structured output is validated, and each evidence quotation must occur in the supplied source excerpt. Evidence quotations total no more than 25 words per analysis. Drafts always require review, including a model conclusion that no change was detected. Missing or truncated source material never proves that a rule was removed.

## Reviewing and approving changes

Open the full official source. Check species, animal-only versus combined weights, length/width/height order, aircraft, route, transit, destination and effective dates. Compare country-entry documents separately from airline carriage rules. Reconcile conflicting current pages and older tariffs instead of choosing an unsupported numeric value.

After verification, edit the relevant policy facts and `reviewed_on`, keeping primary-source links. For an observed change that has been reviewed, add an acknowledgement in `data/policy-source-approvals.json`:

```json
{
  "version": 1,
  "sources": {
    "<source ID from the report>": {
      "source": "<exact official URL>",
      "hash": "<observed_hash reviewed in the report>",
      "method": "primary_source_review",
      "reviewed_on": "YYYY-MM-DD"
    }
  }
}
```

Only a matching URL and content hash clear that source's pending flag. The monitor never writes approvals or travel requirements. A blocked source retains its previous readable observation and pending status. AI output cannot automatically acknowledge itself.

Run:

```text
node --test tests/policy-monitor.test.mjs
node tests/europe-policy.cjs
node tests/north-america-policy.cjs
```

The entire catalogue is not automatically kept current: airlines without recorded primary sources remain an explicit coverage gap. Source availability/hash checks and API drafts do not establish legal accuracy or guarantee that an animal can board a particular flight.
