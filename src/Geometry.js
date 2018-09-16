export function pseudoAngle([dx, dy]) {
    const p = dx / (Math.abs(dx) + Math.abs(dy))
    return dy > 0 ? 3 + p : 1 - p
}

export function ptSub(pt, sub) {
    return [
        pt[0] - sub[0],
        pt[1] - sub[1],
    ]
}

export function ptsEq(ptA, ptB) {
    return ptA[0] === ptB[0] && ptA[1] === ptB[1]
}

export function linesEq(A, B) {
    return ptsEq(A[0], B[0]) && ptsEq(A[1], B[1])
}

export function rightOf(pt, line) {
    const [x, y] = line
    const a = pt[0] - x[0]
    const b = y[0] - x[0]
    const c = pt[1] - x[1]
    const d = y[1] - x[1]

    return 0 > (a * d) - (b * c)
}

export function circumscribed(A, B, C, D) {
    const [Ax, Ay] = A
    const [Bx, By] = B
    const [Cx, Cy] = C
    const [Dx, Dy] = D

    const AxDx = Ax - Dx
    const AyDy = Ay - Dy

    const BxDx = Bx - Dx
    const ByDy = By - Dy

    const CxDx = Cx - Dx
    const CyDy = Cy - Dy

    const ADSq = (AxDx * AxDx) + (AyDy * AyDy)
    const BDSq = (BxDx * BxDx) + (ByDy * ByDy)
    const CDSq = (CxDx * CxDx) + (CyDy * CyDy)

    // AxDx, AyDy, ADSq
    // BxDx, ByDy, BDSq
    // CxDx, CyDy, CDSq
    return (AxDx * (ByDy * CDSq - CyDy * BDSq)
        - AyDy * (BxDx * CDSq - BDSq * CxDx)
        + ADSq * (BxDx * CyDy - CxDx * ByDy)) < 0
}
