import LinkedCycle from './LinkedCycle'
import { pseudoAngle, ptsEq, ptSub } from './Geometry'

export default function VertexCycle(center) {
    const model = {
        center,
        cycle: LinkedCycle(),
        minPt: null,
    }

    function Center() {
        return model.center
    }

    function First() {
        const first = model.cycle.First()

        return first ? first.val.pt : null
    }

    function SetFirst(pt) {
        const node = model.cycle.Get(pt)
        if (typeof node === 'undefined') throw Error(`pt not found: ${pt}`)

        model.cycle.SetFirst(node)
    }

    function CW(pt) {
        const node = model.cycle.Get(pt)
        if (typeof node === 'undefined') throw Error(`pt not found: ${pt}`)

        return node.prev.val.pt
    }

    function CCW(pt) {
        const node = model.cycle.Get(pt)
        if (typeof node === 'undefined') throw Error(`pt not found: ${pt}`)

        return node.next.val.pt
    }

    function Insert(pt) {
        // prevent duplicates
        if (typeof model.cycle.Get(pt) !== 'undefined') return

        const p = pseudoAngle(ptSub(pt, model.center))

        if (model.cycle.Length() === 0) {
            model.cycle.Append(pt, { pt, p })
            model.minPt = pt
        } else {
            // find the min point "min" of the cycle
            const min = model.cycle.Get(model.minPt)

            // for the length of the cycle, check next, if p < next -> insert before
            let node = min
            for (let i = 0; i < model.cycle.Length(); i++) {
                if (p < node.val.p) break
                node = node.next
            }

            model.cycle.InsertBefore(node, pt, { pt, p })

            // if p < min, update min
            if (p < min.val.p) {
                model.minPt = pt
            }
        }
    }

    function Remove(pt) {
        const node = model.cycle.Get(pt)
        if (typeof node === 'undefined') throw Error(`pt not found: ${pt}`)

        // are we removing the min?
        if (ptsEq(pt, model.minPt)) {
            model.minPt = model.cycle.Length() === 1 ? null : node.next.val.pt
        }

        model.cycle.Remove(pt)
    }

    function ToArray() {
        return model.cycle.ToArray().map(({ pt }) => pt)
    }

    return { model, Center, First, CW, CCW, Insert, Remove, SetFirst, ToArray }
}
