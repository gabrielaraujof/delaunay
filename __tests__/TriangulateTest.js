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

            expect(adj[A].First()).toEqual(B)
            expect(adj[A].CW(B)).toEqual(B)
            expect(adj[A].CCW(B)).toEqual(B)

            expect(adj[B].First()).toEqual(A)
            expect(adj[B].CW(A)).toEqual(A)
            expect(adj[B].CCW(A)).toEqual(A)
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

            expect(adj[A].First()).toEqual(B)
            expect(adj[A].CW(B)).toEqual(C)
            expect(adj[A].CW(C)).toEqual(B)
            expect(adj[A].CCW(B)).toEqual(C)
            expect(adj[A].CCW(C)).toEqual(B)

            expect(adj[B].First()).toEqual(C)
            expect(adj[B].CW(A)).toEqual(C)
            expect(adj[B].CW(C)).toEqual(A)
            expect(adj[B].CCW(A)).toEqual(C)
            expect(adj[B].CCW(C)).toEqual(A)

            expect(adj[C].First()).toEqual(A)
            expect(adj[C].CW(A)).toEqual(B)
            expect(adj[C].CW(B)).toEqual(A)
            expect(adj[C].CCW(A)).toEqual(B)
            expect(adj[C].CCW(B)).toEqual(A)
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

            expect(adj[A].First()).toEqual(C)
            expect(adj[A].CW(B)).toEqual(C)
            expect(adj[A].CW(C)).toEqual(B)
            expect(adj[A].CCW(B)).toEqual(C)
            expect(adj[A].CCW(C)).toEqual(B)

            expect(adj[B].First()).toEqual(A)
            expect(adj[B].CW(C)).toEqual(A)
            expect(adj[B].CW(A)).toEqual(C)
            expect(adj[B].CCW(A)).toEqual(C)
            expect(adj[B].CCW(C)).toEqual(A)

            expect(adj[C].First()).toEqual(B)
            expect(adj[C].CW(A)).toEqual(B)
            expect(adj[C].CW(B)).toEqual(A)
            expect(adj[C].CCW(A)).toEqual(B)
            expect(adj[C].CCW(B)).toEqual(A)
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

            expect(adj[A].First()).toEqual(C)
            expect(adj[A].CW(B)).toEqual(C)
            expect(adj[A].CW(C)).toEqual(B)
            expect(adj[A].CCW(B)).toEqual(C)
            expect(adj[A].CCW(C)).toEqual(B)

            expect(adj[B].First()).toEqual(A)
            expect(adj[B].CW(C)).toEqual(A)
            expect(adj[B].CW(A)).toEqual(C)
            expect(adj[B].CCW(A)).toEqual(C)
            expect(adj[B].CCW(C)).toEqual(A)

            expect(adj[C].First()).toEqual(B)
            expect(adj[C].CW(A)).toEqual(B)
            expect(adj[C].CW(B)).toEqual(A)
            expect(adj[C].CCW(A)).toEqual(B)
            expect(adj[C].CCW(B)).toEqual(A)
        })
    })
})
