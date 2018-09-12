import { expect } from 'chai'
import LinkedCycle from '../src/LinkedCycle'

describe('LinkedCycle', () => {

    it('is initialized sensibly', () => {
        const list = LinkedCycle()

        expect(list.Length()).equals(0)
        expect(list.First()).equals(null)
    })

    it('can append items to the end', () => {
        const list = LinkedCycle()

        // ↪ A ->
        list.Append("A")
        expect(list.Length()).equals(1)
        expect(list.First().item).equals("A")

        expect(list.First().next).eqls(list.First())
        expect(list.First().prev).eqls(list.First())

        // ↪ A -> B ->
        list.Append("B")
        expect(list.Length()).equals(2)

        let A = list.First()
        let B = A.next
        expect(A.item).equals("A")
        expect(A.prev).eqls(B)
        expect(A.next).eqls(B)

        expect(B.item).equals("B")
        expect(B.prev).eqls(A)
        expect(B.next).eqls(A)

        // ↪ A -> B -> C
        list.Append("C")
        expect(list.Length()).equals(3)

        let C = B.next
        expect(A.item).equals("A")
        expect(A.prev).eqls(C)
        expect(A.next).eqls(B)

        expect(B.item).equals("B")
        expect(B.prev).eqls(A)
        expect(B.next).eqls(C)

        expect(C.item).equals("C")
        expect(C.prev).eqls(B)
        expect(C.next).eqls(A)
    })

    it('can append items to the end with an offset', () => {
        const list = LinkedCycle()

        // ↪ A -> B ->
        list.Append("A", 0)
        list.Append("B", 0)

        // ↪ A -> C -> B ->
        list.Append("C", 1)
        expect(list.Length()).equals(3)

        const A = list.First()
        const B = A.prev
        const C = A.next
        expect(A.item).equals("A")
        expect(C.item).equals("C")
        expect(B.item).equals("B")

        expect(B.prev).eqls(C)
        expect(B.next).eqls(A)

        expect(A.prev).eqls(B)
        expect(A.next).eqls(C)
    })

    it('can prepend items to the start', () => {
        const list = LinkedCycle()

        // ↪ A ->
        list.Prepend("A")
        expect(list.Length()).equals(1)
        expect(list.First().item).equals("A")

        expect(list.First().next).eqls(list.First())
        expect(list.First().prev).eqls(list.First())

        // ↪ B -> A ->
        list.Prepend("B")
        expect(list.Length()).equals(2)

        let B = list.First()
        let A = B.next
        expect(B.item).equals("B")
        expect(B.prev).eqls(A)
        expect(B.next).eqls(A)

        expect(A.item).equals("A")
        expect(A.prev).eqls(B)
        expect(A.next).eqls(B)

        // ↪ C -> B -> A ->
        list.Prepend("C")
        expect(list.Length()).equals(3)

        let C = list.First()
        expect(A.item).equals("A")
        expect(A.next).eqls(C)
        expect(A.prev).eqls(B)

        expect(B.item).equals("B")
        expect(B.next).eqls(A)
        expect(B.prev).eqls(C)

        expect(C.item).equals("C")
        expect(C.next).eqls(B)
        expect(C.prev).eqls(A)

        // ↪ D -> C -> B -> A ->
        list.Prepend("D")
        expect(list.Length()).equals(4)

        let D = list.First()
        expect(A.item).equals("A")
        expect(A.next).eqls(D)
        expect(A.prev).eqls(B)

        expect(B.item).equals("B")
        expect(B.prev).eqls(C)
        expect(B.next).eqls(A)

        expect(C.item).equals("C")
        expect(C.prev).eqls(D)
        expect(C.next).eqls(B)


        expect(D.item).equals("D")
        expect(D.prev).eqls(A)
        expect(D.next).eqls(C)
    })

    it('can prepend items to the start with an offset', () => {
        const list = LinkedCycle()

        // ↪ C -> B ->
        list.Append("C", 0)
        list.Append("B", 0)

        // ↪ D -> E -> C -> B ->
        list.Prepend("D", 0)
        list.Prepend("E", 1)

        const D = list.First()
        const E = D.next
        const C = E.next
        const B = C.next
        expect(D.item).equals("D")
        expect(E.item).equals("E")
        expect(C.item).equals("C")
        expect(B.item).equals("B")

        expect(D.prev).eqls(B)
        expect(D.next).eqls(E)

        expect(E.prev).eqls(D)
        expect(E.next).eqls(C)

        expect(C.prev).eqls(E)
        expect(C.next).eqls(B)

        expect(B.prev).eqls(C)
        expect(B.next).eqls(D)
    })

    it('supports lookup', () => {
        // ↪ C -> B -> A ->
        const list = LinkedCycle()
        list.Append("B")
        list.Append("A")
        list.Prepend("C")

        expect(list.Get("X")).equals(null)

        expect(list.Get("B").item).equals("B")
        expect(list.Get("B")).eqls(list.First().next)
    })
})
