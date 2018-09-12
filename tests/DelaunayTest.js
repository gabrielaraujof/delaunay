import { expect } from 'chai'

import { DT, LowerCommonTangent, Insert, MergeTriangulations, RightOf, UpperCommonTangent } from '../src/Delaunay'

describe('RightOf', () => {
    it('returns true if pt is strictly "below" a line on canvas', () => {
        const x = [1, 1]
        const y = [2, 2]

        const pt = [2, 3]
        expect(RightOf(pt, [x, y])).equals(true)
    })

    it('returns false if pt is collinear to line', () => {
        const x = [1, 1]
        const y = [2, 2]

        const pt = [3, 3]
        expect(RightOf(pt, [x, y])).equals(false)
    })

    it('returns false if pt is "above" line in canvas', () => {
        const x = [1, 1]
        const y = [2, 2]

        const pt = [2, 1]
        expect(RightOf(pt, [x, y])).equals(false)
    })
})

describe('Delaunay', () => {
    describe('Base Cases', () => {
        it('can create a dt for 1pt', () => {
            const dt = DT()

            dt.InsertPt([1, 1])
            expect(dt.model.edges).eqls([])

            expect(dt.Leftmost()).eqls([1, 1])
            expect(dt.Rightmost()).eqls([1, 1])
        })

        it('can create a dt for 2pts', () => {
            const dt = DT()

            dt.InsertPt([1, 1])
            dt.InsertPt([2, 2])
            expect(dt.model.edges).eqls([
                [[1, 1], [2, 2]],
            ])

            expect(dt.Leftmost()).eqls([1, 1])
            expect(dt.Rightmost()).eqls([2, 2])

            expect(dt.First([1, 1])).eqls([2, 2])
            expect(dt.First([2, 2])).eqls([1, 1])

            expect(dt.CW([2, 2], [1, 1])).eqls([1, 1])
            expect(dt.CCW([2, 2], [1, 1])).eqls([1, 1])
            expect(dt.CW([1, 1], [2, 2])).eqls([2, 2])
            expect(dt.CCW([1, 1], [2, 2])).eqls([2, 2])
        })

        it('can create a dt for 3pts (case 1)', () => {
            //  _ _ C
            //  A _ _
            //  _ B _
            const A = [1, 2]
            const B = [2, 3]
            const C = [3, 1]

            const dt = DT()
            dt.InsertPt(A)
            dt.InsertPt(B)
            dt.InsertPt(C)

            expect(dt.model.edges).eqls([[A, B], [A, C], [B, C]])
            expect(dt.Leftmost()).eqls(A)
            expect(dt.Rightmost()).eqls(C)

            expect(dt.First(A)).eqls(B)
            expect(dt.First(B)).eqls(C)
            expect(dt.First(C)).eqls(A)

            expect(dt.CW(A, B)).eqls(C)
            expect(dt.CW(A, C)).eqls(B)
            expect(dt.CW(B, C)).eqls(A)
            expect(dt.CW(B, A)).eqls(C)
            expect(dt.CW(C, A)).eqls(B)
            expect(dt.CW(C, B)).eqls(A)

            expect(dt.CCW(A, B)).eqls(C)
            expect(dt.CCW(A, C)).eqls(B)
            expect(dt.CCW(B, A)).eqls(C)
            expect(dt.CCW(B, C)).eqls(A)
            expect(dt.CCW(C, A)).eqls(B)
            expect(dt.CCW(C, B)).eqls(A)
        })

        it('can create a dt for 3pts (case 2)', () => {
            //  _ B _
            //  _ _ C
            //  A _ _
            const A = [1, 3]
            const B = [2, 1]
            const C = [3, 2]

            const dt = DT()
            dt.InsertPt(A)
            dt.InsertPt(B)
            dt.InsertPt(C)

            expect(dt.model.edges).eqls([[A, B], [A, C], [B, C]])
            expect(dt.Leftmost()).eqls(A)
            expect(dt.Rightmost()).eqls(C)

            expect(dt.First(A)).eqls(C)
            expect(dt.First(B)).eqls(A)
            expect(dt.First(C)).eqls(B)

            expect(dt.CW(A, B)).eqls(C)
            expect(dt.CW(A, C)).eqls(B)
            expect(dt.CW(B, C)).eqls(A)
            expect(dt.CW(B, A)).eqls(C)
            expect(dt.CW(C, A)).eqls(B)
            expect(dt.CW(C, B)).eqls(A)

            expect(dt.CCW(A, B)).eqls(C)
            expect(dt.CCW(A, C)).eqls(B)
            expect(dt.CCW(B, A)).eqls(C)
            expect(dt.CCW(B, C)).eqls(A)
            expect(dt.CCW(C, A)).eqls(B)
            expect(dt.CCW(C, B)).eqls(A)
        })

        it('can create a dt for 3pts (case 3)', () => {
            //  A B _
            //  _ _ C
            //  _ _ _
            const A = [1, 1]
            const B = [2, 1]
            const C = [3, 2]

            const dt = DT()
            dt.InsertPt(A)
            dt.InsertPt(B)
            dt.InsertPt(C)

            expect(dt.model.edges).eqls([[A, B], [A, C], [B, C]])
            expect(dt.Leftmost()).eqls(A)
            expect(dt.Rightmost()).eqls(C)

            expect(dt.First(A)).eqls(C)
            expect(dt.First(B)).eqls(A)
            expect(dt.First(C)).eqls(B)

            expect(dt.CW(A, B)).eqls(C)
            expect(dt.CW(A, C)).eqls(B)
            expect(dt.CW(B, C)).eqls(A)
            expect(dt.CW(B, A)).eqls(C)
            expect(dt.CW(C, A)).eqls(B)
            expect(dt.CW(C, B)).eqls(A)

            expect(dt.CCW(A, B)).eqls(C)
            expect(dt.CCW(A, C)).eqls(B)
            expect(dt.CCW(B, A)).eqls(C)
            expect(dt.CCW(B, C)).eqls(A)
            expect(dt.CCW(C, A)).eqls(B)
            expect(dt.CCW(C, B)).eqls(A)
        })
    })

    describe('CommonTangents', () => {
        describe('2pts | 2pts', () => {
            it('case 1', () => {
                // A _ | _ D
                // _ B | C _
                const A = [1, 1]
                const B = [2, 2]
                const C = [3, 2]
                const D = [4, 1]

                const L = DT()
                L.InsertPt(A, B)

                const R = DT()
                R.InsertPt(C, D)

                expect(LowerCommonTangent(L, R)).eqls([B, C])
                expect(UpperCommonTangent(L, R)).eqls([A, D])
            })

            it('case 2', () => {
                // A _ | C _
                // _ B | _ D
                const A = [1, 1]
                const B = [2, 2]
                const C = [3, 1]
                const D = [4, 2]

                const L = DT()
                L.InsertPt(A, B)

                const R = DT()
                R.InsertPt(C, D)

                expect(LowerCommonTangent(L, R)).eqls([B, D])
                expect(UpperCommonTangent(L, R)).eqls([A, C])
            })

            it('case 3', () => {
                // _ B | C _
                // A _ | _ D
                const A = [1, 2]
                const B = [2, 1]
                const C = [3, 1]
                const D = [4, 2]

                const L = DT()
                L.InsertPt(A, B)

                const R = DT()
                R.InsertPt(C, D)

                expect(LowerCommonTangent(L, R)).eqls([A, D])
                expect(UpperCommonTangent(L, R)).eqls([B, C])
            })

            it('case 4', () => {
                // _ B | _ D
                // A _ | C _
                const A = [1, 2]
                const B = [2, 1]
                const C = [3, 2]
                const D = [4, 1]

                const L = DT()
                L.InsertPt(A, B)

                const R = DT()
                R.InsertPt(C, D)

                expect(LowerCommonTangent(L, R)).eqls([A, C])
                expect(UpperCommonTangent(L, R)).eqls([B, D])
            })

            it('case 5', () => {
                // _ B | _ _ _ D
                // _ _ | C _ _ _
                // _ _ | _ _ _ _
                // A _ | _ _ _ _
                const A = [1, 4]
                const B = [2, 1]
                const C = [3, 2]
                const D = [6, 1]

                const L = DT()
                L.InsertPt(A, B)

                const R = DT()
                R.InsertPt(C, D)

                expect(LowerCommonTangent(L, R)).eqls([A, D])
                expect(UpperCommonTangent(L, R)).eqls([B, D])
            })

            it('case 6', () => {
                // _ B | _ D
                // _ _ | C _
                // _ _ | _ _
                // A _ | _ _
                const A = [1, 4]
                const B = [2, 1]
                const C = [3, 2]
                const D = [4, 1]

                const L = DT()
                L.InsertPt(A, B)

                const R = DT()
                R.InsertPt(C, D)

                expect(LowerCommonTangent(L, R)).eqls([A, C])
                expect(UpperCommonTangent(L, R)).eqls([B, D])
            })

            it('case 7', () => {
                // _ _ | _ D
                // _ _ | C _
                // _ B | _ _
                // A _ | _ _
                const A = [1, 4]
                const B = [2, 3]
                const C = [3, 2]
                const D = [4, 1]

                const L = DT()
                L.InsertPt(A, B)

                const R = DT()
                R.InsertPt(C, D)

                expect(LowerCommonTangent(L, R)).eqls([B, C])
                expect(UpperCommonTangent(L, R)).eqls([B, C])
            })
        })

        describe('3pts | 3pts', () => {
            it('case 1', () => {
                // A _ _ | _ _ F
                // _ _ C | D _ _
                // _ B _ | _ E _
                const A = [1, 1]
                const B = [2, 3]
                const C = [3, 2]
                const D = [4, 2]
                const E = [5, 3]
                const F = [6, 1]

                const L = DT()
                L.InsertPt(A, B, C)

                const R = DT()
                R.InsertPt(D, E, F)

                expect(LowerCommonTangent(L, R)).eqls([B, E])
                expect(UpperCommonTangent(L, R)).eqls([A, F])
            })

            it('case 2', () => {
                // A _ _ | _ _ F
                // _ _ _ | D _ _
                // B _ C | _ E _
                const A = [1, 1]
                const B = [1, 3]
                const C = [3, 3]
                const D = [4, 2]
                const E = [5, 3]
                const F = [6, 1]

                const L = DT()
                L.InsertPt(A, B, C)

                const R = DT()
                R.InsertPt(D, E, F)

                expect(LowerCommonTangent(L, R)).eqls([C, E])
                expect(UpperCommonTangent(L, R)).eqls([A, F])
            })

            it('case 3', () => {
                // A _ _ | D _ F
                // _ _ _ | E _ _
                // B _ _ | _ _ _
                // _ _ C | _ _ _
                const A = [1, 1]
                const B = [1, 3]
                const C = [3, 4]
                const D = [4, 1]
                const E = [4, 2]
                const F = [6, 1]

                const L = DT()
                L.InsertPt(A, B, C)

                const R = DT()
                R.InsertPt(D, E, F)

                expect(LowerCommonTangent(L, R)).eqls([C, F])
                expect(UpperCommonTangent(L, R)).eqls([A, D])
            })
        })
    })

    describe.only('Insert', () => {

        describe('2pts:2pts', () => {
            it('case 1', () => {
                // A _ | _ D
                // _ B | C _
            })
        })

        describe('3pts:3pts', () => {
            it('case 1', () => {
                // A _ _ | _ _ F
                // _ _ C | D _ _
                // _ B _ | _ E _
                const A = [1, 1]
                const B = [2, 3]
                const C = [3, 2]
                const D = [4, 2]
                const E = [5, 3]
                const F = [6, 1]

                const dtL = DT()
                dtL.InsertPt(A, B, C)

                const dtR = DT()
                dtR.InsertPt(D, E, F)

                const LT = LowerCommonTangent(dtL, dtR)
                const UT = UpperCommonTangent(dtL, dtR)

                const dt = MergeTriangulations(dtL, dtR)

                Insert(dt, LT)
                expect(dt.First(B)).eqls(E)
                expect(dt.CCW(B, E)).eqls(C)
                expect(dt.CW(B, C)).eqls(E)

                expect(dt.First(E)).eqls(F)
                expect(dt.CW(E, F)).eqls(B)
                expect(dt.CCW(E, F)).eqls(D)
                expect(dt.CW(E, B)).eqls(D)
                expect(dt.CCW(E, B)).eqls(F)

                Insert(dt, UT)
                expect(dt.First(A)).eqls(B)
                expect(dt.CW(A, B)).eqls(F)
                expect(dt.CCW(A, F)).eqls(B)

                expect(dt.First(F)).eqls(A)
                expect(dt.CW(F, A)).eqls(E)
                expect(dt.CCW(F, E)).eqls(A)
            })
        })
    })
})

