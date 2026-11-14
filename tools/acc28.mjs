// acc28.mjs (pre-run 28). Read-only. Which mempool transactions are already accepted on chain? A pool transaction counts as
// accepted when one of its outputs is found in the node's own UTXO index (found = accepted; not found = unknown, it may be
// spent since). Usage: node acc28.mjs <kaspa.js> <wrpc-port> <label> <private out.json> [<private in.json from another node>]
// Without an input file it reads the node's own pool. Prints counts only; ids stay in the private files.
import fs from "node:fs"; import { createRequire } from "node:module";
const [sdk, port, label, outf, inf] = process.argv.slice(2); const k = createRequire(import.meta.url)(sdk);
const c = new k.RpcClient({ url: `ws://127.0.0.1:${port}`, encoding: k.Encoding.Borsh, networkId: "testnet-10" }); await c.connect({ timeoutDuration: 5000, retryInterval: 0 });
let list;
if (inf) list = JSON.parse(fs.readFileSync(inf, "utf8")).list;
else { const m = await c.getMempoolEntries({ includeOrphanPool: false, filterTransactionPool: false });
  list = (m.mempoolEntries || []).map((e) => ({ id: e.transaction.verboseData.transactionId, addrs: [...new Set(e.transaction.outputs.map((o) => o.verboseData?.scriptPublicKeyAddress).filter(Boolean))] })); }
const byAddr = new Map(); for (const t of list) for (const a of t.addrs) { if (!byAddr.has(a)) byAddr.set(a, new Set()); byAddr.get(a).add(t.id); }
const found = new Set(); const addrs = [...byAddr.keys()];
// 08:50Z rehearsal: one batch of 20 addresses dropped the websocket (an address with a very large UTXO set); now one address
// per call, skipped if it fails (counted), reconnecting after a drop.
let skipped = 0; const ids = new Set(list.map((t) => t.id)); const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const a of addrs) { try { const r = await c.getUtxosByAddresses({ addresses: [a] }); for (const e of r.entries || []) if (ids.has(e.outpoint.transactionId)) found.add(e.outpoint.transactionId); }
  catch (e) { skipped++; try { await c.disconnect(); } catch {} await sleep(1000); await c.connect({ timeoutDuration: 5000, retryInterval: 0 }); } }
const inPool = new Set((await c.getMempoolEntries({ includeOrphanPool: false, filterTransactionPool: false })).mempoolEntries.map((e) => e.transaction.verboseData.transactionId));
const s = await c.getServerInfo();
const res = { t: new Date().toISOString(), node: label, synced: !!s.isSynced, checked: list.length, addresses: addrs.length, addresses_skipped: skipped, accepted_on_this_node: found.size, of_those_still_in_this_pool: [...found].filter((x) => inPool.has(x)).length, still_in_this_pool: list.filter((t) => inPool.has(t.id)).length };
fs.writeFileSync(outf, JSON.stringify({ ...res, list, accepted: [...found] }));
console.log(JSON.stringify(res)); await c.disconnect(); process.exit(0);
