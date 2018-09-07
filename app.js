import Vue from 'vue'
import { Hull } from './src/Delaunay'

const d = Hull()

new Vue({
    el: '#APP',
    data: { d },
    computed: {
        pts() {
            return d.model.pts
        },
        lines() {
            return d.model.edges
        },
    },
    methods: {
        addPt({ clientX, clientY }) {
            d.Insert([clientX, clientY])
        },
    },
})
