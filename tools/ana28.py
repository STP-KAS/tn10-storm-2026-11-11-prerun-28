# ana28.py (pre-run 28): from the two private sampler files and the private submit file, per phase counts and, for each of
# our transactions, when each node's pool first and last listed it. Prints counts and labels only (no ids).
import json, sys
desk = [json.loads(l) for l in open(sys.argv[1])]; mini = [json.loads(l) for l in open(sys.argv[2])]; subs = [json.loads(l) for l in open(sys.argv[3])]
def span(rows, tid):
    ts = [r['t'] for r in rows if tid in (r.get('ids') or [])]
    return (ts[0][11:19], ts[-1][11:19], len(ts)) if ts else None
for s in subs:
    print(json.dumps({'label': s['label'], 'sent': s['at'][11:19], 'desk_pool': span(desk, s['txid']), 'mini_pool': span(mini, s['txid'])}))
for name, rows in (('desk', desk), ('mini', mini)):
    ids = {}
    for r in rows:
        for i in r.get('ids') or []: ids.setdefault(i, []).append(r['t'])
    longest = max((len(v) for v in ids.values()), default=0)
    print(json.dumps({'node': name, 'samples': len(rows), 'distinct_ids_seen': len(ids), 'longest_listed_samples': longest, 'max_pool': max((r.get('mempool') or 0) for r in rows), 'errors': sum(1 for r in rows if r.get('err')), 'linked_samples': sum(1 for r in rows if r.get('linked')), 'synced_all': all(r.get('synced') for r in rows if 'synced' in r), 'last': {k: rows[-1].get(k) for k in ('t','mempool','peers','linked')}}))
