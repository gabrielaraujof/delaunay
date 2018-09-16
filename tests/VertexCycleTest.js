import { expect } from 'chai'

import VertexCycle from '../src/VertexCycle'
import { pseudoAngle } from '../src/Geometry'

describe('VertexCycle', () => {

    it('defaults', () => {
        const cycle = VertexCycle([5, 2])

        expect(cycle.Center()).eqls([5, 2])

        expect(cycle.First()).eqls(null)
        expect(cycle.ToArray()).eqls([])
    })

    it('Insert', () => {
        const cycle = VertexCycle([5, 2])

        //
        // ↪ [8,5] ->
        cycle.Insert([8, 5])
        cycle.Insert([8, 5])

        expect(cycle.First()).eqls([8, 5])
        expect(cycle.CW([8, 5])).eqls([8, 5])
        expect(cycle.CCW([8, 5])).eqls([8, 5])
        expect(cycle.ToArray()).eqls([[8, 5]])

        //
        // ↪ [8,5] -> [3,4]
        cycle.Insert([3, 4])

        expect(cycle.First()).eqls([8, 5])

        expect(cycle.CW([8, 5])).eqls([3, 4])
        expect(cycle.CCW([8, 5])).eqls([3, 4])

        expect(cycle.CW([3, 4])).eqls([8, 5])
        expect(cycle.CCW([3, 4])).eqls([8, 5])

        expect(cycle.ToArray()).eqls([[8, 5], [3, 4]])

        //
        // ↪ [8,5] -> [3,4] -> [5,5] ->
        cycle.Insert([5, 5])
        expect(cycle.First()).eqls([8, 5])

        expect(cycle.CW([8, 5])).eqls([5, 5])
        expect(cycle.CCW([8, 5])).eqls([3, 4])

        expect(cycle.CW([3, 4])).eqls([8, 5])
        expect(cycle.CCW([3, 4])).eqls([5, 5])

        expect(cycle.CW([5, 5])).eqls([3, 4])
        expect(cycle.CCW([5, 5])).eqls([8, 5])

        expect(cycle.ToArray()).eqls([[8, 5], [3, 4], [5, 5]])

        //
        // ↪ [8,5] -> [6,-2] -> [3,0] -> [3,4] -> [5,5] ->
        cycle.Insert([6, -2])
        cycle.Insert([3, 0])
        expect(cycle.First()).eqls([8, 5])
        expect(cycle.ToArray()).eqls([[8, 5], [6, -2], [3, 0], [3, 4], [5, 5]])
    })

    describe('Remove', () => {

        it('case: simple', () => {
            const cycle = VertexCycle([5, 2])

            //
            // ↪ [8,5] -> [6,-2] -> [3,0] ->
            cycle.Insert([8, 5])
            cycle.Insert([6, -2])
            cycle.Insert([3, 0])
            expect(cycle.ToArray()).eqls([[8, 5], [6, -2], [3, 0]])

            //
            // ↪ [8,5] -> [6,-2] ->
            cycle.Remove([3, 0])
            expect(cycle.First()).eqls([8, 5])
        })

        it('case: removing final item', () => {
            const cycle = VertexCycle([5, 2])

            //
            // ↪ [8,5] ->
            cycle.Insert([8, 5])
            expect(cycle.ToArray()).eqls([[8, 5]])

            //
            // ↪ X
            cycle.Remove([8, 5])
            expect(cycle.First()).eqls(null)
            expect(cycle.ToArray()).eqls([])
        })

        it('case: removing first (not final)', () => {
            const cycle = VertexCycle([5, 2])

            //
            // ↪ [8,5] -> [6,-2] -> [3,0] ->
            cycle.Insert([8, 5])
            cycle.Insert([6, -2])
            cycle.Insert([3, 0])
            expect(cycle.ToArray()).eqls([[8, 5], [6, -2], [3, 0]])

            //
            // ↪ [6,-2] -> [3,0] ->
            cycle.Remove([8, 5])
            expect(cycle.First()).eqls([6, -2])
            expect(cycle.ToArray()).eqls([[6, -2], [3, 0]])
        })

        it('case 3: removing min (not final, not first)', () => {
            const cycle = VertexCycle([5, 2])

            //
            // ↪ [8,5] -> [6,-2] -> [3,0] ->
            cycle.Insert([8, 5])
            cycle.Insert([6, -2])
            cycle.Insert([3, 0])
            expect(cycle.model.minPt).eqls([6, -2])
            expect(cycle.ToArray()).eqls([[8, 5], [6, -2], [3, 0]])

            //
            // ↪ [8,5] -> [3,0] ->
            cycle.Remove([6, -2])
            expect(cycle.model.minPt).eqls([3, 0])
            expect(cycle.ToArray()).eqls([[8, 5], [3, 0]])

            cycle.Remove([8, 5])
            cycle.Remove([3, 0])
            expect(cycle.model.minPt).eqls(null)
            expect(cycle.ToArray()).eqls([])
        })
    })
})
