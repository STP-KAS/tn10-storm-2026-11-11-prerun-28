> **Experimental. We are just trying this.** [Disclaimer](DISCLAIMER.md) · Counts only.

# Playbook, pre-run 28

Roles: the desk and Mini each run one sampler against their own node; the desk sends three normal transactions; the box writes this repo.

## Disk floor (written before the link)

Desk and Mini 100 GB free, box 20 GB. Below that, nothing starts. No compile. Nothing in this pre-run creates node data.

## Status before the link (UTC)

- 07:42Z: both sessions elevated (IsInRole Administrator True, High Mandatory Level), after the operator restarted the bot app as admin. Desk kaspad, serve and keeper, and Mini kaspad, on the same processes as before (started 11 Nov).
- Disk 07:42Z: desk 341.1 GB free, Mini 296.3 GB, box 102 GB; all over the floor.
- Rehearsal 07:45Z (read-only samplers, 12 s each): both testnet-10, synced, DAA moving, 8 peers, not linked; desk pool 0–1, Mini pool 2,705.

## What ran (UTC)

- 07:47Z baseline acceptance check on Mini's pool (Mini and desk UTXO indexes); first try dropped the Mini websocket on one large address (Mini kaspad unaffected), retried one address per call.
- 07:48:32Z and 07:48:36Z samplers started on the desk and Mini.
- 07:48:51Z Mini: port forward (LAN address to its loopback p2p listener) and inbound allow rule for the desk's address only, both named TN10-prerun28-*.
- 07:49:13Z desk `addPeer`: refused by the SDK (string address). 07:50:02Z with a structured address: refused by the node, safe mode.
- 07:50:26Z Mini: forward and rule removed; checked: no forward, 0 TN10-prerun28 rules on Mini and on the desk, nothing listening on that port. Samplers stopped.
- 07:50Z both nodes synced, DAA moving, 8 peers, on their 11 Nov processes. Desk 341 GB free, Mini 296.3 GB.

## Retry 1 (UTC)

- 07:55Z Mini command line, start script and pool recorded (private copies); acceptance check: 2,705, 10 accepted still in the pool.
- 07:56:54Z Ctrl+C to Mini's kaspad; stopped cleanly 28 s later. Wrapper closed. 07:58:07Z started through its scheduled start task with `--unsaferpc` added to the start script (backup kept). 07:58:47Z synced, pool 0.
- 07:59:11Z desk forward and allow rule (Mini's address only); 07:59:28Z Mini addPeer: linked both ways (protocol 11).
- 08:03:24–28Z cut (block rules desk inbound, Mini outbound); 08:06:33–39Z rules removed; 08:06:41Z addPeer again.
- 08:11:57Z end of window: both pools 0; our three transactions landed.
- 08:12:14Z desk forward and allow rule removed. Checked on both machines: no forward, 0 TN10-prerun28 rules, nothing on the forward's port. Samplers stopped. Mini start script restored to the original (hash checked).
- 08:13Z desk kaspad, serve and keeper on their 11 Nov processes; desk synced, 8 peers, 340.9 GB free. Mini kaspad (new process since 07:57Z, same data) synced, peers refilling, 303 GB free.
