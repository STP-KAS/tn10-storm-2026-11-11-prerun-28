// peek28.mjs (pre-run 28). Read-only: structure of mempool entries on one local node (first entry, ids redacted), and the
// fee rate and age spread of the pool. Usage: node peek28.mjs <kaspa.js> <wrpc-port>
import { createRequire } from "node:module"; const [sdk, port] = process.argv.slice(2); const k = createRequire(import.meta.url)(sdk);
const c = new k.RpcClient({ url: `ws://127.0.0.1:${port}`, encoding: k.Encoding.Borsh, networkId: "testnet-10" }); await c.connect({ timeoutDuration: 5000, retryInterval: 0 });
const m = await c.getMempoolEntries({ includeOrphanPool: true, filterTransactionPool: false }); const es = m.mempoolEntries || [];
const red = (x) => JSON.parse(JSON.stringify(x, (key, v) => typeof v === "bigint" ? v.toString() : v).replace(/[0-9a-f]{64}/g, "<id>").replace(/kaspatest:[a-z0-9]+/g, "<addr>"));
console.log(JSON.stringify({ n: es.length, orphans: es.filter((e) => e.isOrphan).length, first: es[0] ? red(es[0]) : null }).slice(0, 3000));
const ins = es.flatMap((e) => (e.transaction?.inputs || []).map((i) => i.previousOutpoint?.transactionId)); const ids = new Set(es.map((e) => e.transaction?.verboseData?.transactionId || e.transaction?.id));
console.log(JSON.stringify({ inputs: ins.length, inputs_from_pool_txs: ins.filter((t) => ids.has(t)).length }));
await c.disconnect(); process.exit(0);
