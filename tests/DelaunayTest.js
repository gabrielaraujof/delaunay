import { expect } from 'chai'
import Delaunay, { UniqueEdges, UniqueTriangles } from '../src/Delaunay'

describe('Delaunay', () => {

    it('Triangulates zero points', () => {
        expect(Delaunay([])).eqls({})
    })

    it('Triangulates n points', () => {
        //   D   F    J
        //   C     G
        // A   E      I
        //   B        H

        const A = [100, 222]
        const B = [178, 291]
        const C = [178, 153]
        const D = [178, 83]
        const E = [250, 222]
        const F = [288, 83]
        const G = [342, 163]
        const H = [398, 280]
        const I = [420, 250]
        const J = [398, 83]

        const pts = [B, C, A, H, E, J, I, F, D, G]

        const adj = Delaunay(pts)
        expect(adj[A].ToArray()).eqls([B, C, D])
        expect(adj[B].ToArray()).eqls([H, E, C, A])
        expect(adj[C].ToArray()).eqls([A, B, E, F, D])
        expect(adj[D].ToArray()).eqls([A, C, F])
        expect(adj[E].ToArray()).eqls([C, B, H, G, F])
        expect(adj[F].ToArray()).eqls([D, C, E, G, J])
        expect(adj[G].ToArray()).eqls([F, E, H, I, J])
        expect(adj[H].ToArray()).eqls([I, G, E, B])
        expect(adj[I].ToArray()).eqls([J, G, H])
        expect(adj[J].ToArray()).eqls([F, G, I])

        const edges = UniqueEdges(adj)
        expect(edges.length).equals(20)

        const triangles = UniqueTriangles(edges)
        expect(triangles.length).equals(11)
    })
})
