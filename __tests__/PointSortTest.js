import PointSort from '../src/PointSort'

describe('PointSort', () => {

    it('sorts point in the (browser) plane', () => {
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

        const pts = [B, B, C, A, H, E, J, I, F, D, G]

        pts.sort(PointSort)

        expect(pts).toEqual([A, B, B, C, D, E, F, G, H, I, J])
    })
})
