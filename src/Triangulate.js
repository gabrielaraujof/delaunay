import VertexCycle from './VertexCycle'
import { rightOf } from './Geometry'

export function Triangulate2(adj, A, B) {
    const cycleA = VertexCycle(A)
    cycleA.Insert(B)

    const cycleB = VertexCycle(B)
    cycleB.Insert(A)

    adj[A] = cycleA
    adj[B] = cycleB
}

export function Triangulate3(adj, A, B, C) {
    const cycleA = VertexCycle(A)
    const cycleB = VertexCycle(B)
    const cycleC = VertexCycle(C)

    if (rightOf(C, [A, B])) {
        cycleA.Insert(C)
        cycleA.Insert(B)

        cycleB.Insert(A)
        cycleB.Insert(C)

        cycleC.Insert(B)
        cycleC.Insert(A)
    } else {
        cycleA.Insert(B)
        cycleA.Insert(C)

        cycleB.Insert(C)
        cycleB.Insert(A)

        cycleC.Insert(A)
        cycleC.Insert(B)
    }

    adj[A] = cycleA
    adj[B] = cycleB
    adj[C] = cycleC
}
