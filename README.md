> **Experimental. We are just trying this.** [Disclaimer](DISCLAIMER.md) · Kaspa Testnet-10 only; tKAS has no value.
>
> **This is a pre-run. Pre-run 28.** It is not the Wednesday run. It is not the Tuesday run. It is not pre-run 1 to 27, 29 or 30, and it does not edit their repos. A read does not start a runner.

# tn10-storm-2026-11-11-prerun-28

**Pre-run 28 of the Wednesday neuron: soft partition.** A short, local cut of a temporary desk–Mini peer link, both kaspad processes left running, and what each node's mempool does once the peer returns. The neuron stays [tn10-storm-2026-11-11](https://github.com/STP-KAS/tn10-storm-2026-11-11).

> **Our own testing.** This is our own Kaspa Testnet-10 testing, run on our own machines and nodes. What these pages report is what we observed in this run; it is not a claim of how TN10 or Kaspa behave in general.

| Field | Value |
|---|---|
| Target | the [target plan](https://github.com/STP-KAS/tn10-target-plan/blob/main/plan/PLAN.md)'s pre-run 28 card: after a brief desk–Mini peer cut, do already-accepted transactions leave each node's mempool within 5 minutes of restore? (#1146 / #1147) |
| The change | a temporary peer link (port forward and allow rule on Mini, non-permanent addPeer on the desk), cut by local block rules, restored, then removed ([plan/PLAN.md](plan/PLAN.md)) |
| Met or not met | open |
| Retry count | 0 |
| Core tags | 5 (mempool behaviour under a partition) |
| Status | open |

## Machines

| Machine | Role |
|---|---|
| Desk | its existing private TN10 node (kaspad 2.1.0, never restarted); sampler, three normal transactions, the desk-side block rule |
| Mini | its existing TN10 node (kaspad 2.1.0, never restarted); sampler; the port forward, allow rule and Mini-side block rule |
| Box | coordination and this repo |
