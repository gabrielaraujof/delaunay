function LinkedCycle() {
    const model = {
        length: 0,
        first: null,
        items: {},
    }

    function Length() {
        return model.length
    }

    function First() {
        return model.first ? model.first : null
    }

    function Append(item, offset = 0) {
        if (model.first === null) {
            const node = { item }
            node.prev = node
            node.next = node
            model.first = node

            model.items[item] = node
        } else {
            offset = ((offset%model.length)+model.length)%model.length

            let after = model.first
            let before = model.first.prev

            for (let i = 0; i < offset; i++) {
                after = after.prev
                before = before.prev
            }
            const X = { item }
            X.next = after
            X.prev = before

            before.next = X
            after.prev = X
            model.items[item] = X
        }

        model.length += 1
    }

    function Prepend(item, offset = 0) {
        Append(item, -offset)
        if (offset === 0) {
            model.first = model.first.prev
        }
    }

    function Get(item) {
        if (typeof model.items[item] === 'undefined') return null
        return model.items[item]
    }

    function ToArray(forward = true) {
        const arr = Array(model.length)

        if (model.length === 0) arr

        let n = forward ? model.first : model.first.prev
        for (let i = 0; i < model.length; i++) {
            arr[i] = n.item
            n = forward ? n.next : n.prev
        }
        return arr
    }

    return { model, Length, First, Append, Prepend, Get, ToArray }
}

export default LinkedCycle
