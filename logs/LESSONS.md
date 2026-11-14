> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only.

# Lessons, pre-run 28

Target: after a brief desk–Mini peer cut, do already-accepted transactions leave each node's mempool? **Not run: blocked before the link.** Baseline: [counts/BASELINE.md](../counts/BASELINE.md).

1. **Elevation came from restarting the bot app as admin.** Opening admin PowerShell windows next to an app that was already running did not elevate the app's shells (07:28Z: IsInRole False, Medium). After the operator restarted the app as admin (08:41 Brussels), both sessions read IsInRole True, High Mandatory Level, Administrators enabled. The node, serve and keeper processes kept their pids.
2. **Both nodes listen for p2p on loopback only**, so a link needs help from outside: a port forward on Mini from its LAN address to its loopback listener and an allow rule for the desk's address only. That part worked (07:48:51Z, listener up).
3. **`addPeer` is a safe-mode-locked RPC.** The desk node answered `Method unavailable in safe mode. Run the node with --unsaferpc argument.` (07:50:02Z); the first try failed earlier on our side (a string address; the RPC wants a structured address). Neither node runs with `--unsaferpc`, and adding it needs a restart, which the rules forbid. We found this only when we tried; it should have been checked in the plan.
4. **Nothing left behind.** The forward and the allow rule were removed at 07:50:26Z and checked: no forward, no TN10-prerun28 rule on either machine, nothing listening on the forward's port. Samplers stopped. No transaction was sent; spend 0.
5. **What we did see: Mini's pool holds accepted transactions before any cut.** 2,705 entries that the desk pool does not have; at least 10 of them have outputs in both nodes' UTXO indexes (accepted) and are still in Mini's pool. That is the shape of #1146 on a node that did no IBD tonight, without any partition. A lower bound; one read.
6. **For a retry.** The link needs one node started with `--unsaferpc` (or with `--addpeer`/`--connect` to the other) at its next planned restart, decided by the operator; or a cut of an existing link if one is ever made. The Mini pool baseline can be re-read then, to see whether a restart or a peer change clears it.
