import { expect } from 'chai'
import LinkedCycle from '../src/LinkedCycle'

describe('LinkedCycle', () => {

    it('defaults', () => {
        const list = LinkedCycle()

        expect(list.Length()).equals(0)
        expect(list.First()).equals(null)
    })

    it('Append', () => {
        const list = LinkedCycle()

        //
        // ↪ A ->
        list.Append("A", 1)

        expect(list.Length()).equals(1)

        const A = list.First()
        expect(A.key).equals("A")
        expect(A.val).equals(1)

        expect(A.next).eqls(A)
        expect(A.prev).eqls(A)

        //
        // ↪ A -> B ->
        list.Append("B", 2)

        expect(list.Length()).equals(2)

        expect(list.First()).equals(A)

        const B = A.next
        expect(B.key).equals("B")
        expect(B.val).equals(2)

        expect(A.prev).eqls(B)

        expect(B.prev).eqls(A)
        expect(B.next).eqls(A)

        //
        // ↪ A -> B -> C
        list.Append("C", 3)

        expect(list.Length()).equals(3)
        expect(list.First()).equals(A)

        const C = A.next.next
        expect(C.key).equals("C")
        expect(C.val).equals(3)

        expect(A.next).eqls(B)
        expect(A.prev).eqls(C)

        expect(B.next).eqls(C)
        expect(B.prev).eqls(A)

        expect(C.next).eqls(A)
        expect(C.prev).eqls(B)
    })

    it('InsertBefore', () => {
        const list = LinkedCycle()

        // ↪ A ->
        list.Append("A", 1)

        // ↪ A -> B ->
        list.InsertBefore(list.Get("A"), "B", 2)
        expect(list.Length()).equals(2)

        const A = list.First()
        const B = A.next

        expect(A.key).equals("A")
        expect(A.val).equals(1)
        expect(A.next).equals(B)
        expect(A.prev).equals(B)

        expect(B.key).equals("B")
        expect(B.val).equals(2)
        expect(B.next).equals(A)
        expect(B.prev).equals(A)

        // ↪ A -> C -> B ->
        list.InsertBefore(list.Get("B"), "C", 3)
        expect(list.Length()).equals(3)

        const C = A.next

        expect(A.key).equals("A")
        expect(A.val).equals(1)
        expect(A.next).equals(C)
        expect(A.prev).equals(B)

        expect(B.key).equals("B")
        expect(B.val).equals(2)
        expect(B.next).equals(A)
        expect(B.prev).equals(C)

        expect(C.key).equals("C")
        expect(C.val).equals(3)
        expect(C.next).equals(B)
        expect(C.prev).equals(A)
    })

    // it.skip('can cycle nodes forward', () => {
    //     const list = LinkedCycle()
    //
    //     // empty case
    //     list.CycleFwd()
    //     expect(list.First()).equals(null)
    //
    //     // single case
    //     // ↪ A ->
    //     list.Append("A", 1)
    //     // ↪ A ->
    //     list.CycleFwd()
    //
    //     const A = list.First()
    //     expect(A.key).eqls("A")
    //     expect(A.val).eqls(1)
    //
    //     //
    //     // ↪ A -> B ->
    //     // becomes: ↪ B -> A ->
    //     list.Append("B", 2)
    //     list.CycleFwd()
    //
    //     const B = list.First()
    //     expect(B.key).eqls("B")
    //     expect(B.val).eqls(2)
    //
    //     expect(B.next).eqls(A)
    //     expect(B.prev).eqls(A)
    //
    //     expect(A.next).eqls(B)
    //     expect(A.prev).eqls(B)
    //
    //     //
    //     // ↪ B -> A -> C->
    //     // becomes: ↪ C -> B -> A
    //     list.Append("C", 3)
    //     list.CycleFwd()
    //
    //     const C = list.First()
    //     expect(C.key).eqls("C")
    //     expect(C.val).eqls(3)
    //
    //     expect(B.next).eqls(A)
    //     expect(B.prev).eqls(C)
    //
    //     expect(A.next).eqls(C)
    //     expect(A.prev).eqls(B)
    //
    //     expect(C.next).eqls(B)
    //     expect(C.prev).eqls(A)
    // })

    it('Get', () => {
        // ↪ A -> B -> C ->
        const list = LinkedCycle()
        list.Append("A", 1)
        list.Append("B", 2)
        list.Append("C", 3)

        const A = list.First()
        const B = A.next
        const C = B.next

        expect(typeof list.Get("X")).equals('undefined')
        expect(list.Get("A")).eqls(A)
        expect(list.Get("B")).eqls(B)
        expect(list.Get("C")).eqls(C)
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

        expect(typeof list.Get("A")).eqls('undefined')
        expect(list.Length()).equals(2)
        expect(A.next).eqls(null)
        expect(A.prev).eqls(null)

        expect(list.First()).eqls(B)

        expect(B.next).eqls(C)
        expect(B.prev).eqls(C)

        expect(C.next).eqls(B)
        expect(C.prev).eqls(B)

        // ↪ B ->
        list.Remove("C")
        expect(typeof list.Get("C")).eqls('undefined')
        expect(list.Length()).equals(1)
        expect(C.next).eqls(null)
        expect(C.prev).eqls(null)

        expect(list.First()).equals(B)

        expect(B.next).eqls(B)
        expect(B.prev).eqls(B)

        list.Remove("B")
        expect(typeof list.Get("B")).eqls('undefined')
        expect(B.next).eqls(null)
        expect(B.prev).eqls(null)
        expect(list.Length()).equals(0)
        expect(list.First()).equals(null)
        expect(list.model.nodes).eqls({})
    })
})
