import SortedInsert from './SortedInsert'
import LinkedCycle from './LinkedCycle'

export function RightOf(pt, vector) {
    const [x, y] = vector
    const a = pt[0] - x[0]
    const b = y[0] - x[0]
    const c = pt[1] - x[1]
    const d = y[1] - x[1]
    return 0 > (a * d) - (b * c)
}

export function LowerCommonTangent(L, R) {
    let X = L.Rightmost()
    let Y = R.Leftmost()

    let $Y = R.First(Y)
    let X$ = L.CW(X, L.First(X))

    while (true) {
        if (RightOf($Y, [X, Y])) {
            let $$Y = R.First($Y)
            Y = $Y
            $Y = $$Y
        } else if (RightOf(X$, [X, Y])) {
            let X$$ = L.CW(X$, X)
            X = X$
            X$ = X$$
        } else {
            return [X, Y]
        }
    }
}

function ptSort(A, B) {
    // sort left-to-right and top-to-bottom
    if (A[0] === B[0]) {
        return A[1] > B[1] ? -1 : 1
    }

    return A[0] < B[0] ? -1 : 1
}

export function MergeTriangulations(l, r) {
    const adj = {
        ...l.model.adj,
        ...r.model.adj,
    }

    const [X, Y] = LowerCommonTangent(l, r)
    adj[X].Prepend(Y)
    adj[Y].Append(X)

    const pts = [
        ...l.model.pts,
        ...r.model.pts,
    ]

    const edges = [
        ...l.model.edges,
        ...r.model.edges,
        [X, Y],
    ]

    return newDT(pts, adj, edges)
}

function newDT(pts, adj, edges) {
    const model = { pts, adj, edges }

    function Insert() {
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
        const node = typeof model.adj[pt] === 'undefined' ? null : model.adj[pt].First()
        return node === null ? null : node.item
    }

    function Pred(ptA, ptB) {
        const node = typeof model.adj[ptA] === 'undefined' ? null : model.adj[ptA].Get(ptB)
        return node === null ? null : node.prev.item
    }

    function Succ(ptA, ptB) {
        const node = typeof model.adj[ptA] === 'undefined' ? null : model.adj[ptA].Get(ptB)
        return node === null ? null : node.next.item
    }

    return { model, Insert, Leftmost, Rightmost, First, CW: Pred, CCW: Succ }
}

export function DT() {
    return newDT([], {}, [])
}

function Triangulate(pts) {
    if (pts.length < 2) {
        return newDT(pts, {}, [])
    }

    if (pts.length === 2) {
        const [A, B] = pts

        const cycleA = LinkedCycle()
        cycleA.Append(B)

        const cycleB = LinkedCycle()
        cycleB.Append(A)

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

        const cycleA = LinkedCycle()
        const cycleB = LinkedCycle()
        const cycleC = LinkedCycle()

        if (RightOf(C, [A, B])) {
            cycleA.Append(C)
            cycleA.Append(B)

            cycleB.Append(A)
            cycleB.Append(C)

            cycleC.Append(B)
            cycleC.Append(A)
        } else {
            cycleA.Append(B)
            cycleA.Append(C)

            cycleB.Append(C)
            cycleB.Append(A)

            cycleC.Append(A)
            cycleC.Append(B)
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

    return MergeTriangulations(left, right)
}


