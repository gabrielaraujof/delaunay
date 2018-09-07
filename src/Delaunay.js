import SortedInsert from './SortedInsert'

export function RightOf(z, line) {
    const [x, y] = line
    const a = z[0] - x[0]
    const b = y[0] - x[0]
    const c = z[1] - x[1]
    const d = y[1] - x[1]
    return 0 < (a * d) - (b * c)
}

export function LowerCommonTangent(V_L, V_R) {
    let X = V_L.Rightmost()
    let Y = V_R.Leftmost()
    let Z0 = V_R.First(Y)
    let Z1 = V_L.First(X)
    let Z2 = V_L.Pred(X, Z1)

    while (true) {
        if (RightOf(Z0, [X, Y])) {
            let tmp = V_R.Succ(Z0, Y)
            Y = Z0
            Z0 = tmp
        } else if (RightOf(Z2, [X, Y])) {
            let tmp = V_L.Pred(Z2, X)
            X = Z2
            Z2 = tmp
        } else {
            return [X, Y]
        }
    }
}

function ptSort(pt, cmp) {
    if (pt[0] === cmp[0]) return pt[1] < cmp[1] ? -1 : 1
    return pt[0] < cmp[0] ? -1 : 1
}

export function MergeTriangulations(left, right) {
    const adj = {}
    Object.keys(left.model.adj).forEach(k => adj[k] = left.model.adj[k])
    Object.keys(right.model.adj).forEach(k => adj[k] = right.model.adj[k])

    const lct = LowerCommonTangent(left, right)
    return newDT(
        left.model.pts.concat(right.model.pts),
        adj,
        left.model.edges.concat(right.model.edges).concat([lct])
    )
}

function newDT(pts, adj, edges) {
    const model = { pts, adj, edges }

    function Insert(pt) {
        SortedInsert(pt, model.pts, ptSort)
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
        return typeof model.adj[pt] === 'undefined' ? pt : model.adj[pt].pt
    }

    function Pred(ptA, ptB) {
        const node = find(model, ptA, ptB)
        return node === null ? null : node.cw.pt
    }

    function Succ(ptA, ptB) {
        const node = find(model, ptA, ptB)
        return node === null ? null : node.ccw.pt
    }

    return { model, Insert, Leftmost, Rightmost, First, Pred, Succ }
}

export function DT() {
    return newDT([], {}, [])
}

function find(model, ptA, ptB) {
    let node = model.adj[ptA]
    if (typeof node === 'undefined') {
        return null
    }

    const first = [node.pt[0], node.pt[1]]

    while (node.pt[0] !== ptB[0] && node.pt[1] !== ptB[1]) {
        node = node.cw
        if (first[0] === ptA[0] && first[1] === ptA[1]) {
            return null
        }
    }

    return node
}

function Triangulate(pts) {
    if (pts.length < 2) {
        return newDT(pts, {}, [])
    }

    if (pts.length === 2) {
        const adj = {}

        const nodeA = { pt: pts[0] }
        nodeA.cw = nodeA
        nodeA.ccw = nodeA

        const nodeB = { pt: pts[1] }
        nodeB.cw = nodeB
        nodeB.ccw = nodeB

        adj[nodeA.pt] = nodeB
        adj[nodeB.pt] = nodeA

        return newDT(pts, adj, [
            [nodeA.pt, nodeB.pt],
        ])
    }

    if (pts.length === 3) {
        const adj = {}

        const A = pts[0]
        const B = pts[1]
        const C = pts[2]

        if (B[1] > A[1]) {
            //   B
            // A   C
            const A_1 = { pt: C }
            const A_2 = { pt: B }
            adj[A] = A_1
            A_1.cw = A_2
            A_1.ccw = A_2
            A_2.cw = A_1
            A_2.ccw = A_1

            const B_1 = { pt: A }
            const B_2 = { pt: C }
            adj[B] = B_1
            B_1.cw = B_2
            B_1.ccw = B_2
            B_2.cw = B_1
            B_2.ccw = B_1

            const C_1 = { pt: B }
            const C_2 = { pt: A }
            adj[C] = C_1
            C_1.cw = C_2
            C_1.ccw = C_2
            C_2.cw = C_1
            C_2.ccw = C_1
        } else {
            // A   C
            //   B
            const A_1 = { pt: B }
            const A_2 = { pt: C }
            adj[A] = A_1
            A_1.cw = A_2
            A_1.ccw = A_2
            A_2.cw = A_1
            A_2.ccw = A_1

            const B_1 = { pt: C }
            const B_2 = { pt: A }
            adj[B] = B_1
            B_1.cw = B_2
            B_1.ccw = B_2
            B_2.cw = B_1
            B_2.ccw = B_1

            const C_1 = { pt: A }
            const C_2 = { pt: B }
            adj[C] = C_1
            C_1.cw = C_2
            C_1.ccw = C_2
            C_2.cw = C_1
            C_2.ccw = C_1
        }

        return newDT(pts, adj, [
            [A, B],
            [B, C],
            [C, A],
        ])
    }

    const mid = pts.length >>> 1
    const left = Triangulate(pts.slice(0, mid))
    const right = Triangulate(pts.slice(mid, pts.length))

    return MergeTriangulations(left, right)
}


