import Vue from 'vue'
import Delaunay2, { UniqueEdges } from './src/Delaunay2'

new Vue({
    el: '#APP',
    data: { ptSet: {}, pts: [], lines: [] },
    methods: {
        addPt({ clientX, clientY }) {
            const pt = [clientX, clientY]
            if (this.ptSet[pt]) return

            this.ptSet[pt] = true
            this.pts.push(pt)

            const adj = Delaunay2(this.pts)

            this.lines = UniqueEdges(adj)
        },
    },
})
