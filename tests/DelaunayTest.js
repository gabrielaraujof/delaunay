import { expect } from 'chai'

import {
    DT,
    Merge,
    MergeTriangulations,
    LowerCommonTangent,
    UpperCommonTangent,
} from '../src/Delaunay'

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

            expect(dt.Pred([2, 2], [1, 1])).eqls([1, 1])
            expect(dt.Succ([2, 2], [1, 1])).eqls([1, 1])
            expect(dt.Pred([1, 1], [2, 2])).eqls([2, 2])
            expect(dt.Succ([1, 1], [2, 2])).eqls([2, 2])
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

            expect(dt.Pred(A, B)).eqls(C)
            expect(dt.Pred(A, C)).eqls(B)
            expect(dt.Pred(B, C)).eqls(A)
            expect(dt.Pred(B, A)).eqls(C)
            expect(dt.Pred(C, A)).eqls(B)
            expect(dt.Pred(C, B)).eqls(A)

            expect(dt.Succ(A, B)).eqls(C)
            expect(dt.Succ(A, C)).eqls(B)
            expect(dt.Succ(B, A)).eqls(C)
            expect(dt.Succ(B, C)).eqls(A)
            expect(dt.Succ(C, A)).eqls(B)
            expect(dt.Succ(C, B)).eqls(A)
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

            expect(dt.Pred(A, B)).eqls(C)
            expect(dt.Pred(A, C)).eqls(B)
            expect(dt.Pred(B, C)).eqls(A)
            expect(dt.Pred(B, A)).eqls(C)
            expect(dt.Pred(C, A)).eqls(B)
            expect(dt.Pred(C, B)).eqls(A)

            expect(dt.Succ(A, B)).eqls(C)
            expect(dt.Succ(A, C)).eqls(B)
            expect(dt.Succ(B, A)).eqls(C)
            expect(dt.Succ(B, C)).eqls(A)
            expect(dt.Succ(C, A)).eqls(B)
            expect(dt.Succ(C, B)).eqls(A)
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

            expect(dt.Pred(A, B)).eqls(C)
            expect(dt.Pred(A, C)).eqls(B)
            expect(dt.Pred(B, C)).eqls(A)
            expect(dt.Pred(B, A)).eqls(C)
            expect(dt.Pred(C, A)).eqls(B)
            expect(dt.Pred(C, B)).eqls(A)

            expect(dt.Succ(A, B)).eqls(C)
            expect(dt.Succ(A, C)).eqls(B)
            expect(dt.Succ(B, A)).eqls(C)
            expect(dt.Succ(B, C)).eqls(A)
            expect(dt.Succ(C, A)).eqls(B)
            expect(dt.Succ(C, B)).eqls(A)
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

    describe('Remove', () => {
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
            const dt = MergeTriangulations(dtL, dtR)

            dt.InsertLine(LT)
            dt.RemoveLine(LT)
            expect(dt.First(B)).eqls(C)
            expect(dt.Pred(B, C)).eqls(A)
            expect(dt.Succ(B, A)).eqls(C)

            expect(dt.First(E)).eqls(F)
            expect(dt.Pred(E, F)).eqls(D)
            expect(dt.Succ(E, D)).eqls(F)
        })
    })

    describe('Insert', () => {
        it('2pts:2pts', () => {
            // A _ D
            // _ B C
            const A = [1, 1]
            const B = [2, 2]
            const C = [3, 2]
            const D = [3, 1]

            const dtL = DT()
            dtL.InsertPt(A, B)

            const dtR = DT()
            dtR.InsertPt(C, D)

            const LT = LowerCommonTangent(dtL, dtR)
            expect(LT).eqls([B, C])

            const UT = UpperCommonTangent(dtL, dtR)
            expect(UT).eqls([A, D])

            const dt = MergeTriangulations(dtL, dtR)
            dt.InsertLine(LT)
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

                dt.InsertLine(LT)
                expect(dt.First(B)).eqls(C)
                expect(dt.Succ(B, E)).eqls(C)
                expect(dt.Pred(B, C)).eqls(E)

                expect(dt.First(E)).eqls(F)
                expect(dt.Pred(E, F)).eqls(B)
                expect(dt.Succ(E, F)).eqls(D)
                expect(dt.Pred(E, B)).eqls(D)
                expect(dt.Succ(E, B)).eqls(F)

                dt.InsertLine(UT)
                expect(dt.First(A)).eqls(B)
                expect(dt.Pred(A, B)).eqls(F)
                expect(dt.Succ(A, F)).eqls(B)

                expect(dt.First(F)).eqls(D)
                expect(dt.Pred(F, A)).eqls(E)
                expect(dt.Succ(F, E)).eqls(A)
            })
        })
    })

    describe('Merge', () => {
        describe('4pts', () => {
            it('case 1', () => {
                // A _ D
                // _ B C
                const A = [1, 1]
                const B = [2, 2]
                const C = [3, 2]
                const D = [3, 1]

                const dt = DT()
                dt.InsertPt(A, B, C, D)
                expect(dt.model.adj[A].ToArray()).eqls([B, D])
                expect(dt.model.adj[B].ToArray()).eqls([C, D, A])
                expect(dt.model.adj[C].ToArray()).eqls([D, B])
                expect(dt.model.adj[D].ToArray()).eqls([A, B, C])
            })
        })

        describe('5pts', () => {
            it('case 1', () => {
                // A _ D _ E
                // _ _ C _ _
                // B _ _ _ _
                const A = [1, 1]
                const B = [1, 3]
                const C = [3, 2]
                const D = [3, 1]
                const E = [5, 1]

                const dt = DT()
                dt.InsertPt(A, B, C, D, E)

                expect(dt.model.adj[A].ToArray()).eqls([B, C, D])
                expect(dt.model.adj[B].ToArray()).eqls([C, A])
                expect(dt.model.adj[C].ToArray()).eqls([E, D, A, B])
                expect(dt.model.adj[D].ToArray()).eqls([A, C, E])
                expect(dt.model.adj[E].ToArray()).eqls([D, C])
            })

            it('case 2', () => {
                // _ _ C _
                // A _ _ D
                // _ _ _ _
                // B _ _ E
                const A = [1, 2]
                const B = [1, 4]
                const C = [3, 1]
                const D = [4, 2]
                const E = [4, 4]

                const dt = DT()
                dt.InsertPt(A, B, C, D, E)
            })

            it.only('case 3', () => {
                // _ _ _ _ _ D _ _
                // _ _ _ _ _ _ _ _
                // _ _ _ _ _ _ _ _
                // E _ _ _ _ _ _ _
                // _ _ _ A _ _ _ _
                // _ _ _ _ _ _ _ B
                // _ _ _ _ _ C _ _
                const A = [8, 11]
                const B = [16, 12]
                const C = [12, 13]
                const D = [13, 1]
                const E = [1, 10]

                const dt = DT()
                dt.InsertPt(A, B, C, D, E)
                expect(dt.model.adj[A].ToArray()).eqls([E, C, D])
                console.log(dt.model.adj[B].ToArray())
                expect(dt.model.adj[B].ToArray()).eqls([D, A, C])
            })
        })

        describe('6pts', () => {

            it('', () => {
                const A = [351, 259]
                const B = [363, 143]
                const C = [387, 213]
                const D = [414, 187]
                const E = [420, 224]
                const F = [393, 279]
            })
        })
    })
})

