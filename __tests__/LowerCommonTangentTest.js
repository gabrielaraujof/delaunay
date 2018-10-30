import { Triangulate2, Triangulate3 } from '../src/Triangulate'
import LowerCommonTangent from '../src/LowerCommonTangent'

describe('LowerCommonTangent', () => {

    it('computes the LCT', () => {
        //   D   F    J
        //   C     G
        // A   E      I
        //   B        H

        const A = [1, 3]
        const B = [2, 4]
        const C = [2, 2]
        const D = [2, 1]
        const E = [3, 3]
        const F = [4, 1]
        const G = [5, 2]
        const H = [6, 4]
        const I = [6, 3]
        const J = [6, 1]

        const adj = {}

        Triangulate3(adj, A, B, C)
        Triangulate2(adj, D, E)
        expect(LowerCommonTangent(adj, C, D)).toEqual([B, E])

        Triangulate3(adj, F, G, H)
        Triangulate2(adj, I, J)
        expect(LowerCommonTangent(adj, H, I)).toEqual([H, I])
    })
})
