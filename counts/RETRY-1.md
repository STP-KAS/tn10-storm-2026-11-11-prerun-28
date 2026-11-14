> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only; tKAS has no value. Counts only.

# Pre-run 28, retry 1: Mini restart, desk–Mini link, cut, restore

One change from the first attempt: Mini's kaspad was restarted once, gracefully, with the same arguments and data directory plus `--unsaferpc`, so the link could be made from the Mini side. The desk node was not restarted. Times UTC, 14 Nov 2026. Both nodes kaspad 2.1.0, testnet-10.

## Mini restart and its pool

| Time | Step | What we saw |
|---|---|---|
| 07:55:34 | Before: Mini pool and acceptance check | 2,705 in the pool; 10 found accepted on Mini's own chain, all 10 still in the pool (1 of 20 output addresses unreadable: lower bound) |
| 07:56:52 | Ctrl+C to Mini's kaspad console | clean shutdown in 28 s, log `Kaspad has stopped...`; its start wrapper was left at the batch "terminate" prompt and was closed |
| 07:57:50 | Start through its own scheduled start task, start script with `--unsaferpc` added | new process; same data directory; RPC and p2p still loopback-only |
| 07:58:47 | First read | synced, 8 peers, **pool 0** |
| 07:59:00 | The 2,705 checked again | 0 of them in the pool (the 10 accepted ones included) |

Mini's data directory was not touched (about 70 GB). The restart took about a minute from Ctrl+C to synced.

## Link, cut, restore (window written before the cut: 5 min after restore; cut max 10 min)

| Time | Step | Desk | Mini |
|---|---|---|---|
| 07:59:12 | Desk: temporary port forward (LAN address → its loopback p2p listener) and an inbound allow rule for Mini's address only | — | — |
| 07:59:28 | Mini `addPeer` (non-permanent) to the desk's forward | Mini listed as inbound, protocol 11 | desk listed as outbound, protocol 11 |
| 08:00:43 | Our transaction 1 (key 0 → key 0, 100 sompi/gram) to the desk | landed (DAA +about 2 s worth) | — |
| 08:03:24–28 | **Cut**: block rules (desk inbound, Mini outbound) for that one port | link gone by the 08:03:46 sample | `connection reset from peer` at 08:03:29.6 |
| 08:04:07 | Our transaction 2 to the desk, during the cut | landed | — |
| 08:03–08:06 | During the cut | synced, DAA +1,807 in 3 min, 8 peers | synced, DAA +1,807, 9 peers; no reconnect attempt to the desk (non-permanent peer) |
| 08:06:33–39 | **Restore**: block rules removed | — | — |
| 08:06:41 | Mini `addPeer` again | Mini back as inbound by the 08:06:46 sample | desk back as outbound |
| 08:07:43 | Our transaction 3 to the desk | landed | — |
| 08:11:57 / 08:12:00 | End of the 5-minute window: pools and acceptance check | **pool 0**, nothing to linger | **pool 0**, nothing to linger |
| 08:12:14 | Desk forward and allow rule removed | link gone by 08:12:16; 8 peers | 7 peers (refilling) |

Samplers every 10 s (desk 75 samples, Mini 74, 0 read errors, both synced in every sample). DAA moved the same on both nodes in each phase (linked 1,780 / 1,775; cut 1,807 / 1,807; restored 3,220 / 3,222). Largest pools: desk 52, Mini 57. **No transaction id was listed in more than one 10-second sample on either node**: 267 distinct ids on the desk and 224 on Mini, each gone by the next sample. Our three transactions were never caught in a sample at all (they landed inside 10 s). The two pools share no id across the samples; with ids living under 10 s, 10-second samples do not catch the same ones, so this says nothing about propagation.

## Result

**Met** for the card as written: at the end of the 5-minute window after restore, neither pool listed any id that either node shows as accepted (both pools were empty), and our three transactions landed before, during and after the cut. The cut itself did not make either node keep transactions on this quiet network.

The #1146 shape was seen only before the restart: Mini held 2,705 old pool entries, at least 10 of them already accepted. A clean restart cleared all of them.
