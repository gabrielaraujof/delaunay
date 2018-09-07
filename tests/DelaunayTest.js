import { expect } from 'chai'

import { Hull, LowerCommonTangent, RightOf } from '../src/Delaunay'

describe('Delaunay', () => {
    it('can create a convex hull for 1pt', () => {
        const hull = Hull()

        hull.Insert([1, 1])
        expect(hull.model.edges).eqls([])

        expect(hull.Leftmost()).eqls([1, 1])
        expect(hull.Rightmost()).eqls([1, 1])

        expect(hull.First([1, 1])).eqls([1, 1])
    })

    it('can create a convex hull for 2pts', () => {
        const hull = Hull()

        hull.Insert([1, 1])
        hull.Insert([2, 2])
        expect(hull.model.edges).eqls([
            [[1, 1], [2, 2]],
        ])

        expect(hull.Leftmost()).eqls([1, 1])
        expect(hull.Rightmost()).eqls([2, 2])

        expect(hull.First([1, 1])).eqls([2, 2])
        expect(hull.First([2, 2])).eqls([1, 1])

        /*
         * Pred & Succ
         */
        expect(hull.Pred([2, 2], [1, 1])).eqls([1, 1])
        expect(hull.Succ([2, 2], [1, 1])).eqls([1, 1])
        expect(hull.Pred([1, 1], [2, 2])).eqls([2, 2])
        expect(hull.Succ([1, 1], [2, 2])).eqls([2, 2])
    })

    it('can create a convex hull for 3pts', () => {
        const hull = Hull()

        hull.Insert([1, 1])
        hull.Insert([2, 2])
        hull.Insert([4, 3])

        expect(hull.model.edges).eqls([
            [[1, 1], [2, 2]],
            [[2, 2], [4, 3]],
            [[4, 3], [1, 1]],
        ])

        expect(hull.Leftmost()).eqls([1, 1])
        expect(hull.Rightmost()).eqls([4, 3])

        expect(hull.First([1, 1])).eqls([4, 3])
        expect(hull.First([2, 2])).eqls([1, 1])
        expect(hull.First([4, 3])).eqls([2, 2])

        /*
         * Pred
         */
        expect(hull.Pred([1, 1], [2, 2])).eqls([4, 3])
        expect(hull.Pred([1, 1], [4, 3])).eqls([2, 2])
        expect(hull.Pred([2, 2], [1, 1])).eqls([4, 3])
        expect(hull.Pred([2, 2], [4, 3])).eqls([1, 1])
        expect(hull.Pred([4, 3], [1, 1])).eqls([2, 2])
        expect(hull.Pred([4, 3], [2, 2])).eqls([1, 1])

        /*
         * Succ
         */
        expect(hull.Succ([1, 1], [2, 2])).eqls([4, 3])
        expect(hull.Succ([1, 1], [4, 3])).eqls([2, 2])
        expect(hull.Succ([2, 2], [1, 1])).eqls([4, 3])
        expect(hull.Succ([2, 2], [4, 3])).eqls([1, 1])
        expect(hull.Succ([4, 3], [1, 1])).eqls([2, 2])
        expect(hull.Succ([4, 3], [2, 2])).eqls([1, 1])
    })

    it('can return lower common tangent for two hulls', () => {
        const V_L = Hull()
        V_L.Insert([1, 2])
        V_L.Insert([2, 1])
        V_L.Insert([3, 3])

        const V_R = Hull()
        V_R.Insert([5, 5])
        V_R.Insert([6, 1])
        V_R.Insert([7, 3])

        let X = V_L.Rightmost()
        expect(X).eqls([3, 3])

        let Y = V_R.Leftmost()
        expect(Y).eqls([5, 5])

        let Z0 = V_R.First(Y)
        expect(Z0).eqls([6, 1])

        let Z1 = V_L.First(X)
        expect(Z1).eqls([1, 2])

        let Z2 = V_L.Pred(X, Z1)
        expect(Z2).eqls([2, 1])

        expect(RightOf(Z0, [X, Y])).equals(true)
        let tmp = V_R.Succ(Z0, Y)
        Y = Z0
        Z0 = tmp
        expect(Y).eqls([6, 1])
        expect(Z0).eqls([7, 3])

        expect(RightOf(Z0, [X, Y])).equals(false)

        expect(RightOf(Z2, [X, Y])).equals(true)
        tmp = V_L.Pred(Z2, X)
        X = Z2
        Z2 = tmp
        expect(X).eqls([2, 1])
        expect(Z2).eqls([1, 2])
        expect(RightOf(Z2, [X, Y])).equals(false)

        expect(LowerCommonTangent(V_L, V_R)).eqls([[2, 1], [6, 1]])
    })

    it.skip('can create a convex hull for 4pts', () => {
        const hull = Hull()

        hull.Insert([1, 1])
        hull.Insert([2, 2])
        hull.Insert([4, 3])
        hull.Insert([5, 1])
    })
})

