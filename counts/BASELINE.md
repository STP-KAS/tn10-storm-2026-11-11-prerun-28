> **Experimental. We are just trying this.** [Disclaimer](../DISCLAIMER.md) · Kaspa Testnet-10 only. Counts only.

# Baseline before any change, pre-run 28

Read-only, before the link was tried. Both nodes kaspad 2.1.0, testnet-10, synced, DAA moving, 8 peers, not peered with each other. Times UTC, 14 Nov 2026. Tool: [tools/acc28.mjs](../tools/acc28.mjs) (a pool transaction counts as accepted when one of its outputs is in that node's own UTXO index; found = accepted, not found = unknown).

| Time | Node | Pool size | Pool transactions checked | Output addresses (read / skipped) | Found accepted on this node | Of those, still in this node's pool |
|---|---|---|---|---|---|---|
| 07:47:05 | Mini | 2,705 (0 orphans) | 2,706 | 23 / 1 | 11 | 10 |
| 07:47:27 | Desk, checking Mini's pool transactions | 0 | 2,706 | 23 / 1 | 10 | 0 (the desk pool held none of them) |

Samplers (every 10 s, 07:48:32–07:50:27): desk pool 0 throughout; Mini pool 2,705 throughout; DAA moving on both; neither listed the other as a peer.

The skipped address has a UTXO set too large for one call (the websocket dropped on it), so 10–11 is a lower bound. Most of the 2,705 pay to few addresses (24 distinct); whose transactions they are was not checked.

Reading: Mini already holds transactions in its pool that both nodes' chains show as accepted, before any cut, which is the shape of issue #1146. Mini has run since 11 Nov without a restart; when they entered its pool was not measured.
