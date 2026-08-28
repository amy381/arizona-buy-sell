# IDX Broker field-name debugging pattern

Repo: `amy381/arizona-buy-sell` (ArizonaBuySell) — mainly `app/fub/listing-alerts/FubApp.tsx`, the saved-search widget embedded in Follow Up Boss.

## The problem this solves

IDX Broker's advertised/configured field names don't always match what their actual search API expects. Multiple times now, a filter in the FUB Listing Alerts widget was broken because the code used a field name that looked reasonable but wasn't the real one:

- **HOA filter**: code used `amax_associationFee` (a fee-amount field) to pass "yes"/"no" — IDX silently ignored it. Real field is `a_associationYN`.
- **Status filter**: code used `a_status` — didn't filter correctly. Real field is `a_propStatus`.
- **Year Built**: checked the same way, turned out already correct (`amin_yearBuilt` / `amax_yearBuilt`) — no fix needed.
- **Property subtype**: `pt=1` (Residential) alone let Manufactured Homes through — confirmed **33% of `pt=1`-only results (3/9 sampled) were Manufactured Homes**. Real fix requires the separate `a_propSubType` field to actually restrict to "Single Family Residence."

Guessing the field name from IDX's admin UI or docs is not reliable. Don't do that again.

## The method — do this every time a filter misbehaves

1. Go to IDX Broker's own **advanced search page** (not the custom widget) for the relevant property type.
2. Set the filter to the value you're trying to reproduce (e.g. HOA = Yes, Status = Active) and run the search.
3. Read the **actual URL** IDX generates for the results. The query string parameter names in that URL are the real field names the API honors — not whatever the admin panel labels the field, and not whatever the widget currently uses.
4. Compare that param name against what's in `FubApp.tsx`. If they don't match, that's the bug.
5. Fix the field name in three places in `FubApp.tsx`: the TypeScript type/interface, the destructuring/parsing logic that reads saved-search params, and the `collectIdxParams` (or equivalent) function that builds the outgoing payload.

## Pitfall: circular "verification"

It's easy to think a field name is verified when it's actually just self-consistent with code that was never independently checked. This happened twice in one session before being caught:

- Confirming `city[]=24281` / `ccz=city` by building a test URL using those exact params **because that's what `collectIdxParams` already emits**, then treating matching results as proof. This only proves the code agrees with itself — it doesn't prove the params are what IDX's backend actually expects.
- Assuming `pt=1` was fully correct because it matched `DEFAULT_FORM`/`CITIES` already hardcoded in the file, without independently checking what listings it actually returned.

**The real test:** verification must originate from IDX Broker's own live advanced-search UI — set the filter, submit, read the resulting URL fresh — not from constructing a URL using values already assumed correct in the codebase. If a "confirmation" step uses any param sourced from the file being debugged, it isn't independent confirmation.

## Confirmed field-name reference (as of Aug 2026)

| Filter | Correct field name | Notes |
|---|---|---|
| HOA / Association | `a_associationYN` | Values: `"yes"` = has HOA, `"no"` = no HOA. NOT `amax_associationFee` (that's the fee amount, ignores yes/no). |
| Status | `a_propStatus` | NOT `a_status`. Active/Pending confirmed working; Closed not explicitly tested. |
| Year Built | `amin_yearBuilt` / `amax_yearBuilt` | Confirmed correct, no change made. |
| Property Type | `pt` | `pt=1` = Residential. Broad bucket — does NOT exclude Manufactured Homes on its own. Must pair with `a_propSubType` to restrict further. |
| Property Subtype | `a_propSubType` | Value confirmed via live IDX UI: `"Single Family Residence"` (exact string, url-encoded as `Single+Family+Residence`). Required alongside `pt=1` to exclude Manufactured Homes — confirmed removes ~33% of otherwise-matching results in a Kingman/$225-300k test case. |
| City | `city[]=<cityID>` paired with `ccz=city` | Kingman=24281, Bullhead City=6295, Golden Valley=18350, Fort Mohave=16601. The envelope key `ccz=city` is required alongside `city[]` — confirmed present in IDX's own generated URLs, not just inferred from the widget's (buggy) client-side serialization, which can drop the `city[]` key name entirely. |

Update this table any time another field is diagnosed this way.
