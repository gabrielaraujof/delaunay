import { Triangulate2, Triangulate3 } from '../src/Triangulate'
import LowerCommonTangent from '../src/LowerCommonTangent'
import Merge from '../src/Merge'

describe('Merge', () => {

    it('merges', () => {
        //   D   F    J
        //   C     G
        // A   E      I
        //   B        H

        const A = [10, 22]
        const B = [18, 29]
        const C = [18, 15]
        const D = [18, 8]
        const E = [25, 22]
        const F = [29, 8]
        const G = [34, 16]
        const H = [40, 28]
        const I = [42, 25]
        const J = [40, 8]

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
        const [L2, R2] = LowerCommonTangent(adj, H, I)

        Merge(adj, L2, R2)

        expect(adj[F].ToArray()).toEqual([H, G, J])
        expect(adj[G].ToArray()).toEqual([F, H, I, J])
        expect(adj[H].ToArray()).toEqual([I, G, F])
        expect(adj[I].ToArray()).toEqual([J, G, H])
        expect(adj[J].ToArray()).toEqual([F, G, I])

        const [L3, R3] = LowerCommonTangent(adj, E, F)
        expect([L3, R3]).toEqual([B, H])

        Merge(adj, L3, R3)
        expect(adj[A].ToArray()).toEqual([B, C, D])
        expect(adj[B].ToArray()).toEqual([H, E, C, A])
        expect(adj[C].ToArray()).toEqual([A, B, E, F, D])
        expect(adj[D].ToArray()).toEqual([A, C, F])
        expect(adj[E].ToArray()).toEqual([C, B, H, G, F])
        expect(adj[F].ToArray()).toEqual([D, C, E, G, J])
        expect(adj[G].ToArray()).toEqual([F, E, H, I, J])
        expect(adj[H].ToArray()).toEqual([I, G, E, B])
        expect(adj[I].ToArray()).toEqual([J, G, H])
        expect(adj[J].ToArray()).toEqual([F, G, I])
    })
})
