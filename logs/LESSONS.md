> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only.

# Lessons, pre-run 28

Target: after a brief desk–Mini peer cut, do already-accepted transactions leave each node's mempool? **First attempt not run (blocked before the link); retry 1 met.** Baseline: [counts/BASELINE.md](../counts/BASELINE.md).

1. **Elevation came from restarting the bot app as admin.** Opening admin PowerShell windows next to an app that was already running did not elevate the app's shells (07:28Z: IsInRole False, Medium). After the operator restarted the app as admin (08:41 Brussels), both sessions read IsInRole True, High Mandatory Level, Administrators enabled. The node, serve and keeper processes kept their pids.
2. **Both nodes listen for p2p on loopback only**, so a link needs help from outside: a port forward on Mini from its LAN address to its loopback listener and an allow rule for the desk's address only. That part worked (07:48:51Z, listener up).
3. **`addPeer` is a safe-mode-locked RPC.** The desk node answered `Method unavailable in safe mode. Run the node with --unsaferpc argument.` (07:50:02Z); the first try failed earlier on our side (a string address; the RPC wants a structured address). Neither node runs with `--unsaferpc`, and adding it needs a restart, which the rules forbid. We found this only when we tried; it should have been checked in the plan.
4. **Nothing left behind.** The forward and the allow rule were removed at 07:50:26Z and checked: no forward, no TN10-prerun28 rule on either machine, nothing listening on the forward's port. Samplers stopped. No transaction was sent; spend 0.
5. **What we did see: Mini's pool holds accepted transactions before any cut.** 2,705 entries that the desk pool does not have; at least 10 of them have outputs in both nodes' UTXO indexes (accepted) and are still in Mini's pool. That is the shape of #1146 on a node that did no IBD tonight, without any partition. A lower bound; one read.
6. **For a retry.** The link needs one node started with `--unsaferpc` (or with `--addpeer`/`--connect` to the other) at its next planned restart, decided by the operator; or a cut of an existing link if one is ever made. The Mini pool baseline can be re-read then, to see whether a restart or a peer change clears it.

## Retry 1

7. **A clean restart cleared Mini's stuck pool.** 2,705 entries before (at least 10 already accepted), 0 after a Ctrl+C stop and a start on the same data. kaspad keeps no pool on disk, so this is expected; it means the #1146 shape on Mini was something that built up in a long-running process (up since 11 Nov), not in its data. We do not know when the entries came in.
8. **Ctrl+C stops kaspad cleanly, but leaves a `.cmd` wrapper at its "terminate batch job" prompt.** The wrapper had to be closed before the scheduled start task would run again (its setting ignores a new start while the old one is "running").
9. **The block rule did cut the open connection.** We predicted Windows firewall rules would only stop new connections; Mini logged `connection reset from peer` 1.5 s after its outbound block rule, and the desk dropped the peer within about 20 s. No need to remove the forward to cut.
10. **A non-permanent peer is not retried.** During the 3-minute cut Mini did not reconnect by itself; the restore needed a second `addPeer`. A permanent peer would retry, but could only be removed by another restart.
11. **On a quiet network the cut changed nothing we could see.** Both nodes stayed synced with the same DAA progress in every phase; every transaction id on either node was gone within one 10-second sample; both pools empty at the end of the window. One short cut, two nodes, light load.
12. **The SDK returns peer fields in snake_case** (`user_agent`, `is_outbound`, `advertised_protocol_version`). That is also why pre-run 30's IBD probe read the protocol as empty.
13. **Housekeeping.** Every TN10-prerun28 rule and forward removed and checked on both machines (none listed, nothing on the forward's port). Mini keeps `--unsaferpc` in its running process (all its RPC listeners are 127.0.0.1); its start script is back to the original, so its next start is as before. Spend: 3 transactions, 0.0049 tKAS.
