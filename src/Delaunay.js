import SortedInsert from './SortedInsert'
import VertexCycle from './VertexCycle'
import { circumscribed, linesEq, rightOf } from './Geometry'

export function DT() {
    return newDT([], {}, [])
}

function pushEdge(model, [X, Y]) {
    const sortedEdge = ptSort(X, Y) === 1 ? [Y, X] : [X, Y]
    model.edges.push(sortedEdge)
}

function popEdge(model, [X, Y]) {
    const sortedEdge = ptSort(X, Y) === 1 ? [Y, X] : [X, Y]
    model.edges = model.edges.filter(e => !linesEq(e, sortedEdge))
}

function newDT(pts, adj, edges) {
    const model = { pts, adj, edges }

    function InsertLine([X, Y]) {
        model.adj[X].Insert(Y)
        model.adj[Y].Insert(X)

        pushEdge(model, [X, Y])
    }

    function RemoveLine([X, Y]) {
        model.adj[X].Remove(Y)
        model.adj[Y].Remove(X)

        popEdge(model, [X, Y])
    }

    function InsertPt() {
        const args = Array.from(arguments)
        if (args.length === 0) throw Error()

        args.forEach(pt => SortedInsert(pt, model.pts, ptSort))

        const dt = Triangulate(model.pts)
        model.adj = dt.model.adj
        model.edges = dt.model.edges
    }

    function Leftmost() {
        return model.pts.length === 0 ? null : model.pts[0]
    }

    function Rightmost() {
        return model.pts.length === 0 ? null : model.pts[model.pts.length - 1]
    }

    function First(pt) {
        const node = model.adj[pt]
        return node ? node.First() : null
    }

    function Pred(ptA, ptB) {
        const node = model.adj[ptA]
        return node ? node.CW(ptB) : null
    }

    function Succ(ptA, ptB) {
        const node = model.adj[ptA]
        return node ? node.CCW(ptB) : null
    }

    return { model, InsertPt, InsertLine, RemoveLine, Leftmost, Rightmost, First, Pred, Succ }
}

export function UpperCommonTangent(L, R) {
    let X = L.Rightmost()
    let Y = R.Leftmost()

    let $X = L.First(X)
    let Y$ = R.Pred(Y, R.First(Y))

    while (true) {
        if (rightOf(Y$, [Y, X])) {
            let Y$$ = R.Pred(Y$, Y)
            Y = Y$
            Y$ = Y$$
        } else if (rightOf($X, [Y, X])) {
            let $$X = L.First($X)
            X = $X
            $X = $$X
        } else {
            return [X, Y]
        }
    }
}

export function LowerCommonTangent(L, R) {
    let X = L.Rightmost()
    let Y = R.Leftmost()

    let $Y = R.First(Y)
    let X$ = L.Pred(X, L.First(X))

    while (true) {
        if (rightOf($Y, [X, Y])) {
            let $$Y = R.First($Y)
            Y = $Y
            $Y = $$Y
        } else if (rightOf(X$, [X, Y])) {
            let X$$ = L.Pred(X$, X)
            X = X$
            X$ = X$$
        } else {
            return [X, Y]
        }
    }
}

function ptSort(A, B) {
    if (A[0] === B[0]) {
        if (A[1] === B[1]) return 0
        return A[1] > B[1] ? -1 : 1
    }

    return A[0] < B[0] ? -1 : 1
}

function Triangulate(pts) {
    if (pts.length < 2) {
        return newDT(pts, {}, [])
    }

    if (pts.length === 2) {
        const [A, B] = pts

        const cycleA = VertexCycle(A)
        cycleA.Insert(B)

        const cycleB = VertexCycle(B)
        cycleB.Insert(A)

        const adj = {
            [A]: cycleA,
            [B]: cycleB,
        }

        return newDT(pts, adj, [
            [A, B],
        ])
    }

    if (pts.length === 3) {
        const [A, B, C] = pts

        const cycleA = VertexCycle(A)
        const cycleB = VertexCycle(B)
        const cycleC = VertexCycle(C)

        if (rightOf(C, [A, B])) {
            cycleA.Insert(C)
            cycleA.Insert(B)

            cycleB.Insert(A)
            cycleB.Insert(C)

            cycleC.Insert(B)
            cycleC.Insert(A)
        } else {
            cycleA.Insert(B)
            cycleA.Insert(C)

            cycleB.Insert(C)
            cycleB.Insert(A)

            cycleC.Insert(A)
            cycleC.Insert(B)
        }

        const adj = {
            [A]: cycleA,
            [B]: cycleB,
            [C]: cycleC,
        }

        return newDT(pts, adj, [
            [A, B],
            [A, C],
            [B, C],
        ])
    }

    const mid = pts.length >>> 1
    const left = Triangulate(pts.slice(0, mid))
    const right = Triangulate(pts.slice(mid, pts.length))

    return Merge(left, right)
}

export function Merge(dtL, dtR) {
    let [L, R] = LowerCommonTangent(dtL, dtR)
    // let UT = UpperCommonTangent(dtL, dtR)

    const dt = MergeTriangulations(dtL, dtR)

    let first = true
    while (true) {
        // 1. insert lower-tangent
        dt.InsertLine([L, R])
        if (first) {
            dt.model.adj[L].SetFirst(R)
            first = false
        }

        // 2. get the candidate point from right side
        const R1 = (function rightCandidate(dt, L, R) {
            let R1 = dt.Pred(R, L)

            if (!rightOf(R1, [R, L])) {
                return false
            }

            let R2 = dt.Pred(R, R1)

            if (!circumscribed(R1, L, R, R2)) {
                return R1
            }

            dt.RemoveLine([R, R1])

            return rightCandidate(dt, L, R)
        })(dt, L, R)

        // 3. get the candidate point from left side
        const L1 = (function leftCandidate(dt, L, R) {
            let L1 = dt.Succ(L, R)

            if (rightOf(L1, [L, R])) {
                return false
            }

            let L2 = dt.Succ(L, L1)

            if (!circumscribed(L1, L, R, L2)) {
                return L1
            }

            dt.RemoveLine([L, L1])

            return leftCandidate(dt, L, R)
        })(dt, L, R)

        // 4. No more candidates? done.
        if (!R1 && !L1) {
            dt.model.adj[R].SetFirst(L)
            return dt
        } else if (!L1) {
            R = R1
        } else if (!R1) {
            L = L1
        } else if (circumscribed(L1, L, R, R1)) {
            R = R1
        } else {
            L = L1
        }
    }
}

export function MergeTriangulations(L, R) {
    const adj = { ...L.model.adj, ...R.model.adj }
    const edges = [...L.model.edges, ...R.model.edges]
    const pts = [...L.model.pts, ...R.model.pts]

    return newDT(pts, adj, edges)
}
