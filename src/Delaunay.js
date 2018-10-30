import { Triangulate2, Triangulate3 } from './Triangulate'
import LowerCommonTangent from './LowerCommonTangent'
import Merge from './Merge'
import PointSort from './PointSort'

export default Delaunay

export function Delaunay(pts) {
    // the output will be an adjacency list of edges
    const adj = {}

    // pass edges into the recursive procedure
    delaunay(pts.sort(PointSort), adj, 0, pts.length - 1)

    return adj
}


function delaunay(pts, adj, l, r) {
    // how many points are we triangulating
    const size = r - l

    // zero or 1 point is the trivial delaunay triangulation
    if (size < 1) return

    // 2 points can be computed easily
    if (size === 1) return Triangulate2(adj, pts[l], pts[r])

    // 3 points can be computed easily
    if (size === 2) return Triangulate3(adj, pts[l], pts[l + 1], pts[r])

    // otherwise we divide into halves:
    const m = l + ((r - l) >>> 1)
    const m2 = m + 1

    delaunay(pts, adj, l, m)
    delaunay(pts, adj, m2, r)

    // and then merge the results
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
