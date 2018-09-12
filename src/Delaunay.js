import SortedInsert from './SortedInsert'
import LinkedCycle from './LinkedCycle'

function det(pt, vector) {
    const [x, y] = vector
    const a = pt[0] - x[0]
    const b = y[0] - x[0]
    const c = pt[1] - x[1]
    const d = y[1] - x[1]
    return (a * d) - (b * c)
}

export function RightOf(pt, vector) {
    return 0 > det(pt, vector)
}

export function UpperCommonTangent(L, R) {
    let X = L.Rightmost()
    let Y = R.Leftmost()

    let $X = L.First(X)
    let Y$ = R.CW(Y, R.First(Y))

    while (true) {
        if (RightOf(Y$, [Y, X])) {
            let Y$$ = R.CW(Y$, Y)
            Y = Y$
            Y$ = Y$$
        } else if (RightOf($X, [Y, X])) {
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
        if (A[1] === B[1]) {
            return 0
        }
        return A[1] > B[1] ? -1 : 1
    }

    return A[0] < B[0] ? -1 : 1
}

export function LinesEq(A, B) {
    const [A_x, A_y] = A
    const [B_x, B_y] = B

    return A_x[0] === B_x[0] && A_x[1] === B_x[1]
        && A_y[0] === B_y[0] && A_y[1] === B_y[1]
}

export function MergeTriangulations(L, R) {
    const adj = {
        ...L.model.adj,
        ...R.model.adj,
    }

    const edges = [
        ...L.model.edges,
        ...R.model.edges,
    ]

    const pts = [
        ...L.model.pts,
        ...R.model.pts,
    ]

    // const tanLower = LowerCommonTangent(L, R)
    // const tanUpper = UpperCommonTangent(L, R)

    // adj[tanLower[0]].Prepend(tanLower[1])
    // adj[tanLower[1]].Append(tanLower[0])
    // edges.push(tanLower)

    // if (!LinesEq(tanUpper, tanLower)) {
    //     adj[tanUpper[0]].Append(tanUpper[1])
    //     adj[tanUpper[1]].Prepend(tanUpper[0])
    //     edges.push(tanUpper)
    // }

    return newDT(pts, adj, edges)
}

export function LeftInsert(cycle, [X, Y]) {
    let next = cycle.First()
    for (let i = 0; i < cycle.Length(); i++) {
        if (RightOf(Y, [X, next.item])) {
            return cycle.Prepend(Y, i)
        }
        next = next.next
    }
    return cycle.Append(Y)
}

function RightInsert(cycle, [X, Y]) {
    let next = cycle.First().prev
    for (let i = 0; i > -(cycle.Length()); i--) {
        if (RightOf(X, [next.item, Y])) {
            return cycle.Append(X, i)
        }
        next = next.next
    }
    return cycle.Prepend(X)
}

export function Insert(dt, edge) {
    LeftInsert(dt.model.adj[edge[0]], edge)
    RightInsert(dt.model.adj[edge[1]], edge)
    dt.model.edges.push(edge)
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

    return { model, InsertPt: Insert, Leftmost, Rightmost, First, CW: Pred, CCW: Succ }
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

    const LT = LowerCommonTangent(left, right)
    const UT = UpperCommonTangent(left, right)

    const dt = MergeTriangulations(left, right)

    Insert(dt, LT)
    Insert(dt, UT)

    return dt
}


