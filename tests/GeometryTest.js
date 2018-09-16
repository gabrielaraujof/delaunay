import { expect } from 'chai'
import { circumscribed, pseudoAngle, ptsEq, ptSub, rightOf } from '../src/Geometry'

describe('Geometry', () => {

    describe('Pseudoangle', () => {
        it('can compare vectors by angle', () => {

            const p = pseudoAngle

            const A = p([2, 0])
            const B = p([3, -2])
            const C = p([1, -1])
            const D = p([1, -3])
            const E = p([0, -3])
            const F = p([-1, -4])
            const G = p([-3, -2])
            const H = p([-2, 0])
            const I = p([-3, 3])
            const J = p([0, 3])
            const K = p([2, 2])
            const L = p([2, 1])

            expect(A).equals(0)
            expect(([D, A, E, K, L, C, F, B, G, H, I, J]).sort()).eqls([
                A, B, C, D, E, F, G, H, I, J, K, L
            ])
        })
    })

    describe('ptSub', () => {
        it('can subtract a point from another', () => {
            expect(ptSub([8, 5], [5, 2])).eqls([3, 3])
        })
    })

    describe('ptsEq', () => {
        it('can subtract a point from another', () => {
            expect(ptsEq([8, 5], [8, 5])).eqls(true)
            expect(ptsEq([8, 5], [8, 4])).eqls(false)
        })
    })

    describe('rightOf', () => {
        it('returns true if pt is strictly "below" a line on canvas', () => {
            const x = [1, 1]
            const y = [2, 2]

            const pt = [2, 3]
            expect(rightOf(pt, [x, y])).equals(true)
        })

        it('returns false if pt is collinear to line', () => {
            const x = [1, 1]
            const y = [2, 2]

            const pt = [3, 3]
            expect(rightOf(pt, [x, y])).equals(false)
        })

        it('returns false if pt is "above" line in canvas', () => {
            const x = [1, 1]
            const y = [2, 2]

            const pt = [2, 1]
            expect(rightOf(pt, [x, y])).equals(false)
        })
    })

    describe('circumscribed', () => {

        it('detects if point inside circle case1', () => {
            // A _ _
            // _ D _
            // B _ C
            const A = [1, 1]
            const B = [1, 3]
            const C = [3, 3]
            const D = [2, 2]

            expect(circumscribed(A, B, C, D)).equals(true)
        })
        it('detects if point inside circle case2', () => {
            // A _ _
            // D _ C
            // B _ _
            const A = [1, 1]
            const B = [1, 3]
            const C = [3, 2]
            const D = [1, 2]

            expect(circumscribed(A, B, C, D)).equals(true)
        })

        it('detects if point outside circle case1', () => {
            // A _ D
            // _ _ _
            // B _ C
            const A = [1, 1]
            const B = [1, 3]
            const C = [3, 3]
            const D = [3, 1]

            expect(circumscribed(A, B, C, D)).equals(false)
        })

        it('detects if point outside circle case2', () => {
            // A D _
            // _ C _
            // B _ _
            const A = [1, 1]
            const B = [1, 3]
            const C = [2, 2]
            const D = [2, 1]

            expect(circumscribed(A, B, C, D)).equals(false)
        })
    })
})
