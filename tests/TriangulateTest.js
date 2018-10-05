import { expect } from 'chai'
import { Triangulate2, Triangulate3 } from '../src/Triangulate'

describe('Triangulate', () => {

    describe('Triangulate2', () => {

        it('creates a valid triangulation from two points', () => {
            // A
            //   B

            const A = [1, 1]
            const B = [2, 2]

            const adj = {}

            Triangulate2(adj, A, B)

            expect(adj[A].First()).eqls(B)
            expect(adj[A].CW(B)).eqls(B)
            expect(adj[A].CCW(B)).eqls(B)

            expect(adj[B].First()).eqls(A)
            expect(adj[B].CW(A)).eqls(A)
            expect(adj[B].CCW(A)).eqls(A)
        })
    })

    describe('Triangulate3', () => {

        it('can create a dt for 3pts (case 1)', () => {
            //  _ _ C
            //  A _ _
            //  _ B _
            const A = [1, 2]
            const B = [2, 3]
            const C = [3, 1]

            const adj = {}

            Triangulate3(adj, A, B, C)

            expect(adj[A].First()).eqls(B)
            expect(adj[A].CW(B)).eqls(C)
            expect(adj[A].CW(C)).eqls(B)
            expect(adj[A].CCW(B)).eqls(C)
            expect(adj[A].CCW(C)).eqls(B)

            expect(adj[B].First()).eqls(C)
            expect(adj[B].CW(A)).eqls(C)
            expect(adj[B].CW(C)).eqls(A)
            expect(adj[B].CCW(A)).eqls(C)
            expect(adj[B].CCW(C)).eqls(A)

            expect(adj[C].First()).eqls(A)
            expect(adj[C].CW(A)).eqls(B)
            expect(adj[C].CW(B)).eqls(A)
            expect(adj[C].CCW(A)).eqls(B)
            expect(adj[C].CCW(B)).eqls(A)
        })

        it('can create a dt for 3pts (case 2)', () => {
            //  _ B _
            //  _ _ C
            //  A _ _
            const A = [1, 3]
            const B = [2, 1]
            const C = [3, 2]

            const adj = {}

            Triangulate3(adj, A, B, C)

            expect(adj[A].First()).eqls(C)
            expect(adj[A].CW(B)).eqls(C)
            expect(adj[A].CW(C)).eqls(B)
            expect(adj[A].CCW(B)).eqls(C)
            expect(adj[A].CCW(C)).eqls(B)

            expect(adj[B].First()).eqls(A)
            expect(adj[B].CW(C)).eqls(A)
            expect(adj[B].CW(A)).eqls(C)
            expect(adj[B].CCW(A)).eqls(C)
            expect(adj[B].CCW(C)).eqls(A)

            expect(adj[C].First()).eqls(B)
            expect(adj[C].CW(A)).eqls(B)
            expect(adj[C].CW(B)).eqls(A)
            expect(adj[C].CCW(A)).eqls(B)
            expect(adj[C].CCW(B)).eqls(A)
        })

        it('can create a dt for 3pts (case 3)', () => {
            //  A B _
            //  _ _ C
            //  _ _ _
            const A = [1, 1]
            const B = [2, 1]
            const C = [3, 2]

            const adj = {}

            Triangulate3(adj, A, B, C)

            expect(adj[A].First()).eqls(C)
            expect(adj[A].CW(B)).eqls(C)
            expect(adj[A].CW(C)).eqls(B)
            expect(adj[A].CCW(B)).eqls(C)
            expect(adj[A].CCW(C)).eqls(B)

            expect(adj[B].First()).eqls(A)
            expect(adj[B].CW(C)).eqls(A)
            expect(adj[B].CW(A)).eqls(C)
            expect(adj[B].CCW(A)).eqls(C)
            expect(adj[B].CCW(C)).eqls(A)

            expect(adj[C].First()).eqls(B)
            expect(adj[C].CW(A)).eqls(B)
            expect(adj[C].CW(B)).eqls(A)
            expect(adj[C].CCW(A)).eqls(B)
            expect(adj[C].CCW(B)).eqls(A)
        })
    })
})
