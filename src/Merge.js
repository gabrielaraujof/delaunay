import { circumscribed, rightOf } from './Geometry'

export default function Merge(adj, L, R) {
    let first = true

    while (true) {
        // 1. insert lower-tangent
        adj[L].Insert(R)
        adj[R].Insert(L)
        if (first) {
            adj[L].SetFirst(R)
            first = false
        }

        // 2. get the candidate point from right side
        let rightCandidate = false
        while (true) {
            const R$ = adj[R].CW(L)

            if (!rightOf(R$, [R, L])) {
                rightCandidate = false
                break
            }

            const R$$ = adj[R].CW(R$)

            if (!circumscribed(R$, L, R, R$$)) {
                rightCandidate = R$
                break
            }

            adj[R].Remove(R$)
            adj[R$].Remove(R)
        }

        // 3. get the candidate point from left side
        let leftCandidate = false
        while (true) {
            const $L = adj[L].CCW(R)
            if (rightOf($L, [L, R])) {
                leftCandidate = false
                break
            }

            const $$L = adj[L].CCW($L)

            if (!circumscribed($L, L, R, $$L)) {
                leftCandidate = $L
                break
            }

            adj[L].Remove($L)
            adj[$L].Remove(L)
        }

        // 4. No more candidates? done.
        if (!rightCandidate && !leftCandidate) {
            adj[R].SetFirst(L)
            return adj
        }

        if (!leftCandidate) {
            R = rightCandidate
        } else if (!rightCandidate) {
            L = leftCandidate
        } else if (circumscribed(leftCandidate, L, R, rightCandidate)) {
            R = rightCandidate
        } else {
            L = leftCandidate
        }
    }
}
