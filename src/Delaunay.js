import { Triangulate2, Triangulate3 } from './Triangulate'
import LowerCommonTangent from './LowerCommonTangent'
import Merge from './Merge'
import PointSort from './PointSort'

export default function (pts) {
    const adj = {}

    delaunay(pts.sort(PointSort), adj, 0, pts.length - 1)

    return adj
}

function delaunay(pts, adj, l, r) {
    const size = r - l

    if (size < 1) return

    if (size === 1) return Triangulate2(adj, pts[l], pts[r])

    if (size === 2) return Triangulate3(adj, pts[l], pts[l + 1], pts[r])

    const m = l + ((r - l) >>> 1)
    const m2 = m + 1

    delaunay(pts, adj, l, m)
    delaunay(pts, adj, m2, r)

    const [L, R] = LowerCommonTangent(adj, pts[m], pts[m2])
    Merge(adj, L, R)
}

export function UniqueEdges(adj) {
    const edges = {}

    Object.keys(adj).forEach(pt => {
        const a = adj[pt].Center()

        adj[pt].ToArray().forEach(b => {
            if (PointSort(a, b) === -1) {
                edges[[a[0], a[1], b[0], b[1]]] = [a, b]
            } else {
                edges[[b[0], b[1], a[0], a[1]]] = [b, a]
            }
        })
    })

    return Object.keys(edges).map(key => edges[key])
}

export function UniqueTriangles(edges) {

    function triangle(a, b, c) {
        return [[a, b, c]]
    }

    function UniquePoints([edgeA, edgeB, edgeC]) {
        return Object.values([...edgeA, ...edgeB, ...edgeC]
            .reduce((set, pt) => Object.assign(set, { [pt]: pt }), {}))
    }

    const triangles = edges.reduce((ta, a, i) => {
        return ta.concat(edges.slice(i + 1).reduce((tb, b, j) => {
            return tb.concat(edges.slice(i + 2 + j).reduce((tc, c) => {
                return tc.concat(triangle(a, b, c))
            }, []))
        }, []))
    }, [])

    return triangles
        .map(UniquePoints)
        .filter(pts => pts.length === 3)
}
