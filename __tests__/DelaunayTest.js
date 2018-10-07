import Delaunay, { UniqueEdges } from '../src/Delaunay'

describe('Delaunay', () => {

    it('Triangulates zero points', () => {
        expect(Delaunay([])).toEqual({})
    })

    it('Triangulates n points', () => {
        //   D     F   I
        //   C       G
        // A
        //       E       J
        //   B         H

        const A = [1, 3]
        const B = [2, 5]
        const C = [2, 2]
        const D = [2, 1]
        const E = [4, 4]
        const F = [5, 1]
        const G = [6, 2]
        const H = [7, 5]
        const I = [7, 1]
        const J = [8, 4]

        const pts = [B, C, A, H, E, J, I, F, D, G]

        const adj = Delaunay(pts)
        expect(adj[A].ToArray()).toEqual([B, C, D])
        expect(adj[B].ToArray()).toEqual([H, E, C, A])
        expect(adj[C].ToArray()).toEqual([A, B, E, F, D])
        expect(adj[D].ToArray()).toEqual([A, C, F])
        expect(adj[E].ToArray()).toEqual([C, B, H, G, F])
        expect(adj[F].ToArray()).toEqual([D, C, E, G, I])
        expect(adj[G].ToArray()).toEqual([F, E, H, J, I])
        expect(adj[H].ToArray()).toEqual([J, G, E, B])
        expect(adj[I].ToArray()).toEqual([F, G, J])
        expect(adj[J].ToArray()).toEqual([I, G, H])

        const edges = UniqueEdges(adj)
        expect(edges.length).toEqual(20)
    })
})
