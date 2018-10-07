import VertexCycle from '../src/VertexCycle'

describe('VertexCycle', () => {

    it('defaults', () => {
        const cycle = VertexCycle([5, 2])

        expect(cycle.Center()).toEqual([5, 2])

        expect(cycle.First()).toEqual(null)
        expect(cycle.ToArray()).toEqual([])
    })

    it.only('Insert (readme example)', () => {
        // Given a center point P
        const P = [5, 4]

        // and a new vertex cycle centered at P
        const cycle = VertexCycle(P)

        // when the following points are inserted (in arbitrary order)
        const A = [1, 5]
        const B = [4, 7]
        const C = [3, 1]
        const D = [7, 6]
        const E = [7, 2]
        const F = [9, 3]

        cycle.Insert(A)
        cycle.Insert(C)
        cycle.Insert(E)
        cycle.Insert(D)
        cycle.Insert(F)
        cycle.Insert(B)

        // then they should be in counter-clockwise order from the first insert
        expect(cycle.ToArray()).toEqual([A, B, D, F, E, C])
    })

    it('Insert', () => {
        const cycle = VertexCycle([5, 2])

        //
        // ↪ [8,5] ->
        cycle.Insert([8, 5])
        cycle.Insert([8, 5])

        expect(cycle.First()).toEqual([8, 5])
        expect(cycle.CW([8, 5])).toEqual([8, 5])
        expect(cycle.CCW([8, 5])).toEqual([8, 5])
        expect(cycle.ToArray()).toEqual([[8, 5]])

        //
        // ↪ [8,5] -> [3,4]
        cycle.Insert([3, 4])

        expect(cycle.First()).toEqual([8, 5])

        expect(cycle.CW([8, 5])).toEqual([3, 4])
        expect(cycle.CCW([8, 5])).toEqual([3, 4])

        expect(cycle.CW([3, 4])).toEqual([8, 5])
        expect(cycle.CCW([3, 4])).toEqual([8, 5])

        expect(cycle.ToArray()).toEqual([[8, 5], [3, 4]])

        //
        // ↪ [8,5] -> [3,4] -> [5,5] ->
        cycle.Insert([5, 5])
        expect(cycle.First()).toEqual([8, 5])

        expect(cycle.CW([8, 5])).toEqual([5, 5])
        expect(cycle.CCW([8, 5])).toEqual([3, 4])

        expect(cycle.CW([3, 4])).toEqual([8, 5])
        expect(cycle.CCW([3, 4])).toEqual([5, 5])

        expect(cycle.CW([5, 5])).toEqual([3, 4])
        expect(cycle.CCW([5, 5])).toEqual([8, 5])

        expect(cycle.ToArray()).toEqual([[8, 5], [3, 4], [5, 5]])

        //
        // ↪ [8,5] -> [6,-2] -> [3,0] -> [3,4] -> [5,5] ->
        cycle.Insert([6, -2])
        cycle.Insert([3, 0])
        expect(cycle.First()).toEqual([8, 5])
        expect(cycle.ToArray()).toEqual([[8, 5], [6, -2], [3, 0], [3, 4], [5, 5]])
    })

    describe('Remove', () => {

        it('not found', () => {
            const cycle = VertexCycle([5, 2])

            let err = false
            try {
                cycle.Remove([4, 8])
            } catch(e) {
                err = true
            }

            expect(err).toEqual(true)
        })

        it('case: simple', () => {
            const cycle = VertexCycle([5, 2])

            //
            // ↪ [8,5] -> [6,-2] -> [3,0] ->
            cycle.Insert([8, 5])
            cycle.Insert([6, -2])
            cycle.Insert([3, 0])
            expect(cycle.ToArray()).toEqual([[8, 5], [6, -2], [3, 0]])

            //
            // ↪ [8,5] -> [6,-2] ->
            cycle.Remove([3, 0])
            expect(cycle.First()).toEqual([8, 5])
        })

        it('case: removing final item', () => {
            const cycle = VertexCycle([5, 2])

            //
            // ↪ [8,5] ->
            cycle.Insert([8, 5])
            expect(cycle.ToArray()).toEqual([[8, 5]])

            //
            // ↪ X
            cycle.Remove([8, 5])
            expect(cycle.First()).toEqual(null)
            expect(cycle.ToArray()).toEqual([])
        })

        it('case: removing first (not final)', () => {
            const cycle = VertexCycle([5, 2])

            //
            // ↪ [8,5] -> [6,-2] -> [3,0] ->
            cycle.Insert([8, 5])
            cycle.Insert([6, -2])
            cycle.Insert([3, 0])
            expect(cycle.ToArray()).toEqual([[8, 5], [6, -2], [3, 0]])

            //
            // ↪ [6,-2] -> [3,0] ->
            cycle.Remove([8, 5])
            expect(cycle.First()).toEqual([6, -2])
            expect(cycle.ToArray()).toEqual([[6, -2], [3, 0]])
        })

        it('case 3: removing min (not final, not first)', () => {
            const cycle = VertexCycle([5, 2])

            //
            // ↪ [8,5] -> [6,-2] -> [3,0] ->
            cycle.Insert([8, 5])
            cycle.Insert([6, -2])
            cycle.Insert([3, 0])
            expect(cycle.model.minPt).toEqual([6, -2])
            expect(cycle.ToArray()).toEqual([[8, 5], [6, -2], [3, 0]])

            //
            // ↪ [8,5] -> [3,0] ->
            cycle.Remove([6, -2])
            expect(cycle.model.minPt).toEqual([3, 0])
            expect(cycle.ToArray()).toEqual([[8, 5], [3, 0]])

            cycle.Remove([8, 5])
            cycle.Remove([3, 0])
            expect(cycle.model.minPt).toEqual(null)
            expect(cycle.ToArray()).toEqual([])
        })
    })

    describe('SetFirst', () => {

        it('can set the first item of the cycle', () => {
            const cycle = VertexCycle([5, 2])

            cycle.Insert([2, 3])
            cycle.Insert([4, 8])

            cycle.SetFirst([4, 8])

            expect(cycle.First()).toEqual([4, 8])
        })

        it('throws error if setting first to not found', () => {
            const cycle = VertexCycle([5, 2])

            let err = false
            try {
                cycle.SetFirst([4, 8])
            } catch(e) {
                err = true
            }

            expect(err).toEqual(true)
        })
    })

    describe('CW + CCW', () => {

        it('throws error if not found', () => {
            const cycle = VertexCycle([5, 2])

            let err = false
            try {
                cycle.CW([8, 5])
            } catch(e) {
                err = true
            }

            expect(err).toEqual(true)

            let err2 = false
            try {
                cycle.CCW([8, 5])
            } catch(e) {
                err2 = true
            }

            expect(err2).toEqual(true)
        })
    })
})
