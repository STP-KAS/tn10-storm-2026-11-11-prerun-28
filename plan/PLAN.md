> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only.

# Plan, pre-run 28 (soft partition), written before the link is made

From the [target plan](https://github.com/STP-KAS/tn10-target-plan/blob/main/plan/PLAN.md), pre-run 28 card: after a brief loss of the desk–Mini peer link, with both processes left running, do transactions the other side has already accepted leave the mempool once the peer returns? Context: issue #1146 (a synced TN10 node keeping already-accepted transactions after IBD) and open PR #1147 (full mempool revalidation when IBD completes). A short peer cut is not that IBD path; this is an observation next to those tickets, on kaspad 2.1.0 on both nodes.

## Why a link has to be made first

Both nodes listen for p2p on loopback only, so before tonight there was no desk–Mini peer link to cut (pre-run 26 and 30 notes). Neither node may be restarted to change that. With admin sessions now on both machines (operator, 14 Nov 08:41 Brussels), the link is made from outside the nodes: a port forward on Mini from its LAN address to its own loopback p2p listener, an inbound allow rule on Mini for that port from the desk's LAN address only, then a non-permanent `addPeer` on the desk node. Hosts, ports and ids stay in private files.

## Steps (UTC, times set when run)

1. Pre-flight: disk floor (desk and Mini 100 GB, box 20 GB), both nodes testnet-10, synced, DAA moving, 8 peers; protected processes listed.
2. Baseline, before any change: each node's pool read and checked for already-accepted transactions ([tools/acc28.mjs](../tools/acc28.mjs): a pool transaction counts as accepted when one of its outputs is in that node's own UTXO index; found = accepted, not found = unknown).
3. Samplers on both machines ([tools/samp28.mjs](../tools/samp28.mjs)), every 10 s for the whole run: synced, DAA, mempool size and ids (ids private), peers, whether the other node is a connected peer.
4. Link: forward + allow rule on Mini; `addPeer` on the desk. Linked phase 4 minutes; one normal transaction (key 0 → key 0, 100 sompi/gram, [tools/sub28.mjs](../tools/sub28.mjs)) to the desk at +1 min.
5. Cut: block rules for the one port (Mini inbound, desk outbound). If the open connection survives 2 minutes of block, remove the forward. Target 3 minutes from the peer drop, hard maximum 10. One normal transaction to the desk during the cut.
6. Restore: block rules removed (forward re-added if it was removed), `addPeer` again. One normal transaction at +1 min. Observe 5 minutes.
7. After the window: acceptance check again on both nodes; our three transactions checked for landing ([tools/land28.mjs](../tools/land28.mjs)).
8. Remove: the forward and every TN10-prerun28-* rule; check and log that none is left; check the desk no longer lists Mini as a peer; both nodes synced with DAA moving.

## Pass, as the card says

Met if the post-restore sample on each node, at the end of the 5-minute window, no longer lists ids that the same node or the peer shows as accepted. Not met if such ids remain: logged as the same shape as #1146 and pointed at open #1147. Either is a finished target. Void if the network itself drops and the cut is not what we did.

## Baseline already seen in the rehearsal (07:45–07:47Z, read-only, before any change)

- Desk pool 0–1; Mini pool 2,705, no orphans. Mini had 11 pool transactions whose outputs are in its own UTXO index (accepted), 10 of them still in its pool; the desk's UTXO index has outputs of 10 of Mini's pool transactions, and the desk pool holds none of the 2,705. One of 24 output addresses could not be read (its UTXO set is too large for one call), so these are lower bounds.
- So Mini already holds accepted transactions in its pool before the cut: the card's "not met" shape exists on Mini before we touch anything.

## Prediction

The link forms (Mini sees the desk inbound, the desk sees Mini outbound). The block rule alone does not drop an open connection (Windows firewall rules apply to new connections); removing the forward does. Our three transactions land within seconds and leave both pools. Mini's 2,705 old entries are not cleared by the cut and restore: a peer reconnect does not revalidate the pool, so the post-restore result on Mini is **not met** (the #1146 shape), and the desk stays clean (met on the desk).
