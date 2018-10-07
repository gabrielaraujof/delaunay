export default function (A, B) {
    // if they share same x-coord
    if (A[0] === B[0]) {
        // then A comes before B iff A's y-coord is higher than B's y-coord
        return A[1] > B[1] ? -1 : 1
    }

    // otherwise A comes before B iff A's x-coord is lower than B's y-coord
    return A[0] < B[0] ? -1 : 1
}
