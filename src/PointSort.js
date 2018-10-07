export default function (A, B) {
    // if they share same x-coord
    if (A[0] === B[0]) {
        // then A comes before B if its y-coord is higher
        return A[1] > B[1] ? -1 : 1
    }

    // otherwise A comes before B if its x-coord is lower
    return A[0] < B[0] ? -1 : 1
}
