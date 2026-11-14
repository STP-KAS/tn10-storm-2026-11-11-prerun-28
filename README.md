> **Experimental. We are just trying this.** [Disclaimer](DISCLAIMER.md) · Kaspa Testnet-10 only; tKAS has no value.
>
> **This is a pre-run. Pre-run 28.** It is not the Wednesday run. It is not the Tuesday run. It is not pre-run 1 to 27, 29 or 30, and it does not edit their repos. A read does not start a runner.

# tn10-storm-2026-11-11-prerun-28

**Pre-run 28 of the Wednesday neuron: soft partition.** A short, local cut of a temporary desk–Mini peer link, both kaspad processes left running, and what each node's mempool does once the peer returns. The neuron stays [tn10-storm-2026-11-11](https://github.com/STP-KAS/tn10-storm-2026-11-11).

> **Our own testing.** This is our own Kaspa Testnet-10 testing, run on our own machines and nodes. What these pages report is what we observed in this run; it is not a claim of how TN10 or Kaspa behave in general.

| Field | Value |
|---|---|
| Target | the [target plan](https://github.com/STP-KAS/tn10-target-plan/blob/main/plan/PLAN.md)'s pre-run 28 card: after a brief desk–Mini peer cut, do already-accepted transactions leave each node's mempool within 5 minutes of restore? (#1146 / #1147) |
| The change | a temporary peer link, cut by local block rules, restored, then removed; on retry 1 the forward and allow rule were on the desk and Mini made the non-permanent addPeer ([plan/PLAN.md](plan/PLAN.md)) |
| Met or not met | first attempt: not run (desk `addPeer` refused in safe mode). **Retry 1: met**: after a 3-minute cut and restore, both pools were empty at the end of the 5-minute window; our three transactions landed before, during and after the cut. Before the retry, Mini's pool held 2,705 old entries (at least 10 already accepted, the #1146 shape); its clean restart with `--unsaferpc` cleared them all ([counts/RETRY-1.md](counts/RETRY-1.md), [counts/BASELINE.md](counts/BASELINE.md), [LESSONS](logs/LESSONS.md)) |
| Retry count | 1 (Mini's kaspad restarted once, same arguments and data directory plus `--unsaferpc`; link made from the Mini side) |
| Core tags | 5 (mempool behaviour under a partition) |
| Status | done 2026-11-14 (retry 1, 07:55–08:12Z); every TN10-prerun28 rule and forward removed and checked on both machines; desk node never restarted; Mini running on its data with `--unsaferpc` (RPC loopback-only), its start script back to the original |

## Machines

| Machine | Role |
|---|---|
| Desk | its existing private TN10 node (kaspad 2.1.0, never restarted); sampler, three normal transactions; on retry 1 the temporary forward, allow rule and desk-side block rule |
| Mini | its existing TN10 node (kaspad 2.1.0); restarted once on retry 1 (graceful, same data, plus `--unsaferpc`); sampler; addPeer; Mini-side block rule |
| Box | coordination and this repo |
