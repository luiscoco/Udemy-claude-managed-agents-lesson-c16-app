# C16 · Memory Stores Across Sessions

Executes a local memory-record CAS example. It neither provisions a cloud memory store nor proves cross-session retrieval. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Read-only memory references
- Review before writing
- Compare-and-set content hashes

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3016`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3016
```

## How the app was build

### 1. Enforce access before changing memory

The seeded memory starts at version 1. A read-only reference is rejected before the proposed new text can be applied.

Source: [src/lesson.ts](src/lesson.ts#L13) · selected statements

```typescript
const current = { version: 1, text: "Use TypeScript." };

if (flag(input, "readOnly"))
  return report(
    "rejected",
    "Read-only references cannot write memory",
    { version: 1 },
    ["Check authorized access before mutation"],
  );
```

### 2. Reject a stale expected version

The version check prevents a caller from overwriting a memory record it has not reviewed. A conflict returns the current version and content hash for a deliberate reread.

Source: [src/lesson.ts](src/lesson.ts#L15)

```typescript
if (number(input, "expectedVersion") !== current.version)
  return report(
    "conflict",
    "Memory changed; reread and review before retrying",
    { version: 1, currentHash: hash(current.text) },
    ["Compare the expected memory version", "Reject a stale write"],
  );
```

### 3. Return a versioned content update

A successful local update advances to version 2 and reports old and new hashes. Each experiment starts from the seed; this is not a persistent memory service or an effect-deduplication ledger.

Source: [src/lesson.ts](src/lesson.ts#L16) · selected statements

```typescript
const updated = { version: 2, text: text(input, "newText") };

return report(
  "passed",
  "Applied a reviewed update to the local memory record",
  { ...updated, oldHash: hash(current.text), newHash: hash(updated.text) },
  [
    "Read the seed memory",
    "Review new content",
    "Apply compare-and-set",
    "Memory is not a business-effect ledger",
  ],
);
```

### Check your understanding

Run **Update the reviewed memory** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "expectedVersion": 1,
    "newText": "Use TypeScript and explicit evidence.",
    "readOnly": false
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "version": 2
  }
}
```

Then try **Reject a stale writer**. Its expected outcome is `conflict`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
