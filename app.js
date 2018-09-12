import Vue from 'vue'
import { DT } from './src/Delaunay'

const d = DT()

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
            d.InsertPt([clientX, clientY])
        },
    },
})
