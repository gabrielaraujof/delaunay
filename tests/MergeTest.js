import { expect } from 'chai'
import { Triangulate2, Triangulate3 } from '../src/Triangulate'
import LowerCommonTangent from '../src/LowerCommonTangent'
import Merge from '../src/Merge'

describe('Merge', () => {

    it('merges', () => {
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

        const adj = {}

        Triangulate3(adj, A, B, C)
        Triangulate2(adj, D, E)
        const [L1, R1] = LowerCommonTangent(adj, C, D)

        Merge(adj, L1, R1)

        expect(adj[A].ToArray()).eqls([B, C, D])
        expect(adj[B].ToArray()).eqls([E, C, A])
        expect(adj[C].ToArray()).eqls([A, B, E, D])
        expect(adj[D].ToArray()).eqls([A, C, E])
        expect(adj[E].ToArray()).eqls([D, C, B])

        Triangulate3(adj, F, G, H)
        Triangulate2(adj, I, J)
        const [L2, R2] = LowerCommonTangent(adj, H, I)

        Merge(adj, L2, R2)

        expect(adj[F].ToArray()).eqls([H, G, J])
        expect(adj[G].ToArray()).eqls([F, H, I, J])
        expect(adj[H].ToArray()).eqls([I, G, F])
        expect(adj[I].ToArray()).eqls([J, G, H])
        expect(adj[J].ToArray()).eqls([F, G, I])

        const [L3, R3] = LowerCommonTangent(adj, E, F)
        expect([L3, R3]).eqls([B, H])

        Merge(adj, L3, R3)
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
    })
})
