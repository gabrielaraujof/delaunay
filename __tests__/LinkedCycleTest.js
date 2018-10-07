import LinkedCycle from '../src/LinkedCycle'

describe('LinkedCycle', () => {

    it('defaults', () => {
        const list = LinkedCycle()

        expect(list.Length()).toEqual(0)
        expect(list.First()).toEqual(null)
    })

    it('Append', () => {
        const list = LinkedCycle()

        //
        // ↪ A ->
        list.Append("A", 1)

        expect(list.Length()).toEqual(1)

        const A = list.First()
        expect(A.key).toEqual("A")
        expect(A.val).toEqual(1)

        expect(A.next).toEqual(A)
        expect(A.prev).toEqual(A)

        //
        // ↪ A -> B ->
        list.Append("B", 2)

        expect(list.Length()).toEqual(2)

        expect(list.First()).toEqual(A)

        const B = A.next
        expect(B.key).toEqual("B")
        expect(B.val).toEqual(2)

        expect(A.prev).toEqual(B)

        expect(B.prev).toEqual(A)
        expect(B.next).toEqual(A)

        //
        // ↪ A -> B -> C
        list.Append("C", 3)

        expect(list.Length()).toEqual(3)
        expect(list.First()).toEqual(A)

        const C = A.next.next
        expect(C.key).toEqual("C")
        expect(C.val).toEqual(3)

        expect(A.next).toEqual(B)
        expect(A.prev).toEqual(C)

        expect(B.next).toEqual(C)
        expect(B.prev).toEqual(A)

        expect(C.next).toEqual(A)
        expect(C.prev).toEqual(B)
    })

    it('InsertBefore', () => {
        const list = LinkedCycle()

        // ↪ A ->
        list.Append("A", 1)

        // ↪ A -> B ->
        list.InsertBefore(list.Get("A"), "B", 2)
        expect(list.Length()).toEqual(2)

        const A = list.First()
        const B = A.next

        expect(A.key).toEqual("A")
        expect(A.val).toEqual(1)
        expect(A.next).toEqual(B)
        expect(A.prev).toEqual(B)

        expect(B.key).toEqual("B")
        expect(B.val).toEqual(2)
        expect(B.next).toEqual(A)
        expect(B.prev).toEqual(A)

        // ↪ A -> C -> B ->
        list.InsertBefore(list.Get("B"), "C", 3)
        expect(list.Length()).toEqual(3)

        const C = A.next

        expect(A.key).toEqual("A")
        expect(A.val).toEqual(1)
        expect(A.next).toEqual(C)
        expect(A.prev).toEqual(B)

        expect(B.key).toEqual("B")
        expect(B.val).toEqual(2)
        expect(B.next).toEqual(A)
        expect(B.prev).toEqual(C)

        expect(C.key).toEqual("C")
        expect(C.val).toEqual(3)
        expect(C.next).toEqual(B)
        expect(C.prev).toEqual(A)
    })

    it('Get', () => {
        // ↪ A -> B -> C ->
        const list = LinkedCycle()
        list.Append("A", 1)
        list.Append("B", 2)
        list.Append("C", 3)

        const A = list.First()
        const B = A.next
        const C = B.next

        expect(typeof list.Get("X")).toEqual('undefined')
        expect(list.Get("A")).toEqual(A)
        expect(list.Get("B")).toEqual(B)
        expect(list.Get("C")).toEqual(C)
    })

    it('Remove', () => {
        // ↪ A -> B -> C ->
        const list = LinkedCycle()
        list.Append("A")
        list.Append("B")
        list.Append("C")

        const A = list.First()
        const B = A.next
        const C = B.next

        //
        // ↪ B -> C ->
        list.Remove("A")

        expect(typeof list.Get("A")).toEqual('undefined')
        expect(list.Length()).toEqual(2)
        expect(A.next).toEqual(null)
        expect(A.prev).toEqual(null)

        expect(list.First()).toEqual(B)

        expect(B.next).toEqual(C)
        expect(B.prev).toEqual(C)

        expect(C.next).toEqual(B)
        expect(C.prev).toEqual(B)

        // ↪ B ->
        list.Remove("C")
        expect(typeof list.Get("C")).toEqual('undefined')
        expect(list.Length()).toEqual(1)
        expect(C.next).toEqual(null)
        expect(C.prev).toEqual(null)

        expect(list.First()).toEqual(B)

        expect(B.next).toEqual(B)
        expect(B.prev).toEqual(B)

        list.Remove("B")
        expect(typeof list.Get("B")).toEqual('undefined')
        expect(B.next).toEqual(null)
        expect(B.prev).toEqual(null)
        expect(list.Length()).toEqual(0)
        expect(list.First()).toEqual(null)
        expect(list.model.nodes).toEqual({})

        list.Remove("B")
    })
})
