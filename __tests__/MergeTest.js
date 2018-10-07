import { Triangulate2, Triangulate3 } from '../src/Triangulate'
import LowerCommonTangent from '../src/LowerCommonTangent'
import Merge from '../src/Merge'

describe('Merge', () => {

    it('merges', () => {
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

        const adj = {}

        Triangulate3(adj, A, B, C)
        Triangulate2(adj, D, E)
        const [L1, R1] = LowerCommonTangent(adj, C, D)

        Merge(adj, L1, R1)

        expect(adj[A].ToArray()).toEqual([B, C, D])
        expect(adj[B].ToArray()).toEqual([E, C, A])
        expect(adj[C].ToArray()).toEqual([A, B, E, D])
        expect(adj[D].ToArray()).toEqual([A, C, E])
        expect(adj[E].ToArray()).toEqual([D, C, B])

        Triangulate3(adj, F, G, H)
        Triangulate2(adj, I, J)
        const [L2, R2] = LowerCommonTangent(adj, H, J)

        Merge(adj, L2, R2)

        expect(adj[F].ToArray()).toEqual([H, G, I])
        expect(adj[G].ToArray()).toEqual([F, H, J, I])
        expect(adj[H].ToArray()).toEqual([J, G, F])
        expect(adj[I].ToArray()).toEqual([F, G, J])
        expect(adj[J].ToArray()).toEqual([I, G, H])

        const [L3, R3] = LowerCommonTangent(adj, E, F)
        expect([L3, R3]).toEqual([B, H])

        Merge(adj, L3, R3)
        expect(adj[A].ToArray()).toEqual([B, C, D])
        expect(adj[B].ToArray()).toEqual([H, E, C, A])
        expect(adj[C].ToArray()).toEqual([A, B, E, F, D])
        expect(adj[D].ToArray()).toEqual([A, C, F])
        expect(adj[E].ToArray()).toEqual([C, B, H, G, F])
        expect(adj[F].ToArray()).toEqual([D, C, E, G, I])
        expect(adj[G].ToArray()).toEqual([F, E, H, J, I])
        expect(adj[H].ToArray()).toEqual([J, G, E, B])
        expect(adj[J].ToArray()).toEqual([I, G, H])
        expect(adj[I].ToArray()).toEqual([F, G, J])
    })
})
