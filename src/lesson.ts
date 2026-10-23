import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 16,
  title: "Memory Stores Across Sessions",
  description: "A project convention learned during one conversation can be useful in the next. A fresh session does not automatically inherit that earlier context, so we need an explicit way to carry knowledge forward.",
  concepts: ["Read-only memory references", "Review before writing", "Compare-and-set content hashes"],
  scope: "Executes a local memory-record CAS example. It neither provisions a cloud memory store nor proves cross-session retrieval. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Update the reviewed memory", "input": {"expectedVersion": 1, "newText": "Use TypeScript and explicit evidence.", "readOnly": false}, "expected": "passed", "checks": {"version": 2}}, {"id": "1", "label": "Reject a stale writer", "input": {"expectedVersion": 0, "newText": "Replace conventions", "readOnly": false}, "expected": "conflict", "checks": {"version": 1}}, {"id": "2", "label": "Enforce read-only access", "input": {"expectedVersion": 1, "newText": "Change memory", "readOnly": true}, "expected": "rejected", "checks": {"version": 1}}],
  async run(input) {

const current={version:1,text:"Use TypeScript."};
if(flag(input,"readOnly"))return report("rejected","Read-only references cannot write memory",{version:1},["Check authorized access before mutation"]);
if(number(input,"expectedVersion")!==current.version)return report("conflict","Memory changed; reread and review before retrying",{version:1,currentHash:hash(current.text)},["Compare the expected memory version","Reject a stale write"]);
const updated={version:2,text:text(input,"newText")};
return report("passed","Applied a reviewed update to the local memory record",{...updated,oldHash:hash(current.text),newHash:hash(updated.text)},["Read the seed memory","Review new content","Apply compare-and-set","Memory is not a business-effect ledger"]);

  }
};
