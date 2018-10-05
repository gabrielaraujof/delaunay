export default function (A, B) {
    if (A[0] === B[0]) {
        if (A[1] === B[1]) return 0
        return A[1] > B[1] ? -1 : 1
    }

    return A[0] < B[0] ? -1 : 1
}
