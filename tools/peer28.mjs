// peer28.mjs (pre-run 28). TESTNET-10 ONLY. addPeer (non-permanent) on the local node, or list whether a peer with the given
// user-agent comment is connected. The address is given on the command line and never printed.
// Usage: node peer28.mjs <kaspa.js> <wrpc-port> add <ip:port> | node peer28.mjs <kaspa.js> <wrpc-port> show <ua-comment>
import { createRequire } from "node:module"; const [sdk, port, mode, arg] = process.argv.slice(2); const k = createRequire(import.meta.url)(sdk);
const c = new k.RpcClient({ url: `ws://127.0.0.1:${port}`, encoding: k.Encoding.Borsh, networkId: "testnet-10" }); await c.connect({ timeoutDuration: 5000, retryInterval: 0 });
const s = await c.getServerInfo(); if (s.networkId !== "testnet-10") { console.log("refuse: not testnet-10"); process.exit(2); }
const o = { t: new Date().toISOString(), mode };
if (mode === "add") { try { const [ip, pt] = arg.split(":"); await c.addPeer({ peerAddress: { ip, port: Number(pt) }, isPermanent: false }); /* 07:49Z: a string address was refused ("expected struct ContextualNetAddress") */ o.add = "ok"; } catch (e) { o.add = "error: " + String(e?.message || e).replace(/\d{1,3}(\.\d{1,3}){3}(:\d+)?/g, "<host>").slice(0, 160); } }
const ps = (await c.getConnectedPeerInfo()).peerInfo || []; const lk = ps.filter((x) => String(x.userAgent ?? x.user_agent ?? "").includes(mode === "show" ? arg : "stp-mini"));
o.peers = ps.length; o.linked = lk.length; o.link = lk.map((x) => ({ outbound: !!(x.isOutbound ?? x.is_outbound), protocol: Number(x.advertisedProtocolVersion ?? x.advertised_protocol_version), ua: String(x.userAgent ?? x.user_agent).replace(/[^ -~]/g, ""), ping_ms: Number(x.lastPingDuration ?? x.last_ping_duration), since_s: Math.round((Date.now() - Number(x.timeConnected ?? x.time_connected)) / 1000) }));
console.log(JSON.stringify(o)); await c.disconnect(); process.exit(0);
