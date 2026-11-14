// samp28.mjs (pre-run 28, soft partition). TESTNET-10 ONLY. Reads ONE local node over its loopback wRPC port every N s:
// synced, virtual DAA, mempool size, mempool ids, peer count, whether the other machine's node is a connected peer
// (matched on its user-agent comment). Ids go only to the private file; stdout prints counts.
// Usage: node samp28.mjs <kaspa.js> <wrpc-port> <label> <other-ua-comment> <private out.jsonl> <seconds> <every-s>
import fs from "node:fs"; import { createRequire } from "node:module";
const [sdk, port, label, otherUa, outf, secs, every] = process.argv.slice(2); const k = createRequire(import.meta.url)(sdk);
const to = (p, ms) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error("timeout")), ms))]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let c = null; const open = async () => { c = new k.RpcClient({ url: `ws://127.0.0.1:${port}`, encoding: k.Encoding.Borsh, networkId: "testnet-10" }); await to(c.connect({ timeoutDuration: 5000, retryInterval: 0 }), 7000); };
const end = Date.now() + Number(secs) * 1000;
while (Date.now() < end) {
  const o = { t: new Date().toISOString(), node: label };
  try { if (!c) await open();
    const s = await to(c.getServerInfo(), 5000); o.synced = !!s.isSynced; o.net = s.networkId; o.vdaa = Number(s.virtualDaaScore);
    const m = await to(c.getMempoolEntries({ includeOrphanPool: false, filterTransactionPool: false }), 8000);
    const ids = (m.mempoolEntries || []).map((e) => String(e.transaction?.id ?? e.transaction?.verboseData?.transactionId ?? "")); o.mempool = ids.length; o.ids = ids;
    const p = await to(c.getConnectedPeerInfo(), 5000); const ps = p.peerInfo || []; o.peers = ps.length;
    const lk = ps.filter((x) => String(x.userAgent || "").includes(otherUa)); o.linked = lk.length > 0; o.link_outbound = lk.map((x) => !!x.isOutbound);
  } catch (e) { o.err = String(e?.message || e).slice(0, 80); try { await c?.disconnect(); } catch {} c = null; }
  fs.appendFileSync(outf, JSON.stringify(o) + "\n");
  const { ids, ...pub } = o; console.log(JSON.stringify(pub));
  await sleep(Number(every) * 1000);
}
try { await c?.disconnect(); } catch {} process.exit(0);
