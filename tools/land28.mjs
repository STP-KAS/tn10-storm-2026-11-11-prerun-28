// land28.mjs (pre-run 28). Read-only: for each of our sub28 transactions, is its output in the desk node's UTXO set (landed)?
import fs from "node:fs"; import { CFG, P, connect, to } from "../kit27/lib.mjs"; import { keyAddress } from "../kit27/covenant.mjs";
const subs = fs.readFileSync(P("private", "sub28.jsonl"), "utf8").trim().split(/\n/).map(JSON.parse);
const rpc = await connect(CFG.main_node_url, 3); const u = (await to(rpc.getUtxosByAddresses({ addresses: [keyAddress(0)] }), 90000)).entries || [];
for (const s of subs) { const e = u.find((x) => x.outpoint.transactionId === s.txid); console.log(JSON.stringify({ label: s.label, at: s.at, landed: !!e, daa: e ? Number(e.blockDaaScore) : null })); }
await rpc.disconnect(); process.exit(0);
