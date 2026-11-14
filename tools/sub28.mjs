// sub28.mjs (pre-run 28). TESTNET-10 ONLY. One normal transaction, key 0 -> key 0, 100 sompi/gram, to the desk node only.
// Usage (desk run dir, config.json there): node sub28.mjs --label <phase>. Txid to private/sub28.jsonl only.
import fs from "node:fs"; import { createRequire } from "node:module";
import { CFG, P, connect, to, massOf } from "../kit27/lib.mjs"; import { keyAddress } from "../kit27/covenant.mjs";
const k = createRequire(import.meta.url)(CFG.kaspa_sdk); const i = process.argv.indexOf("--label"); const label = i > 0 ? process.argv[i + 1] : "x";
const lines = fs.readFileSync(CFG.keys_file, "utf8").trim().split(/\r?\n/).map((s) => s.trim()).filter(Boolean); const pk0 = new k.PrivateKey(lines[0]); const A0 = keyAddress(0);
const rpc = await connect(CFG.main_node_url, 3);
const bag = ((await to(rpc.getUtxosByAddresses({ addresses: [A0] }), 90000)).entries || []).filter((e) => !e.isCoinbase && BigInt(e.amount) >= 2_000_000_000n && BigInt(e.amount) <= 3_000_000_000n);
const e = bag[Math.floor(Math.random() * bag.length)]; const outs = (fee) => [new k.PaymentOutput(new k.Address(A0), BigInt(e.amount) - fee)];
const fee = BigInt(massOf(k.createTransaction([e], outs(100000n), 0n, undefined, 1))) * 100n; const tx = k.signTransaction(k.createTransaction([e], outs(fee), 0n, undefined, 1), [pk0], true);
const o = { at: new Date().toISOString(), label, fee_tkas: Number(fee) / 1e8 };
try { const r = await to(rpc.submitTransaction({ transaction: tx, allowOrphan: false }), 15000, "submit"); o.accepted = true; fs.appendFileSync(P("private", "sub28.jsonl"), JSON.stringify({ ...o, txid: String(r?.transactionId || tx.id) }) + "\n"); }
catch (err) { o.accepted = false; o.error = String(err?.message || err).replace(/[0-9a-f]{64}/gi, "<id>").slice(0, 200); }
console.log(JSON.stringify(o)); await rpc.disconnect(); process.exit(0);
