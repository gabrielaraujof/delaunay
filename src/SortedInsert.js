function findInsertPos(needle, haystack, cmp) {
    let left = 0
    let right = haystack.length
    if (right === 0) return 0
    while (true) {
        const pivot = left + ((right - left) >>> 1)
        const direction = cmp(needle, haystack[pivot])

        if (direction < 0) {
            if (right - left <= 1) return pivot
            right = pivot
        } else if (direction > 0) {
            if (right - left <= 1) return pivot + 1
            left = pivot
        } else {
            return -1
        }
    }
}

export default function SortedInsert(item, sorted, sortFn) {
    const pos = findInsertPos(item, sorted, sortFn)
    if (pos !== -1) sorted.splice(pos, 0, item)
}
