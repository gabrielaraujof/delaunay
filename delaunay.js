(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.D = {})));
}(this, (function (exports) { 'use strict';

    function LinkedCycle() {
        const model = {
            length: 0,
            first: null,
            nodes: {},
        };

        function Length() {
            return model.length
        }

        function Get(item) {
            return model.nodes[item]
        }

        function First() {
            return model.first
        }

        function SetFirst(node) {
            model.first = node;
        }

        function InsertBefore(next, key, val) {
            const prev = next.prev;
            const node = { key, val, next, prev };

            model.nodes[key] = node;
            model.length += 1;

            prev.next = node;
            next.prev = node;
        }

        function Append(key, val) {
            if (model.first !== null) {
                return InsertBefore(model.first, key, val)
            }

            const node = { key, val };
            node.prev = node;
            node.next = node;

            model.first = node;

            model.nodes[key] = node;
            model.length += 1;
        }

        function Remove(item) {
            const node = Get(item);
            if (typeof node === 'undefined') return

            model.length--;
            delete(model.nodes[item]);

            if (model.length === 0) {
                model.first = null;
                node.next = null;
                node.prev = null;
                return
            }

            const before = node.prev;
            const after = node.next;
            node.next = null;
            node.prev = null;

            before.next = after;
            after.prev = before;

            if (node === model.first) {
                model.first = after;
            }
        }

        function ToArray() {
            const arr = Array(model.length);

            let n = model.first;
            for (let i = 0; i < model.length; i++) {
                arr[i] = n.val;
                n = n.next;
            }
            return arr
        }

        return { model, Length, Get, First, SetFirst, Append, InsertBefore, Remove, ToArray }
    }

    function pseudoAngle([dx, dy]) {
        const p = dx / (Math.abs(dx) + Math.abs(dy));
        return dy > 0 ? 3 + p : 1 - p
    }

    function ptSub(pt, sub) {
        return [
            pt[0] - sub[0],
            pt[1] - sub[1],
        ]
    }

    function ptsEq(ptA, ptB) {
        return ptA[0] === ptB[0] && ptA[1] === ptB[1]
    }

    function rightOf(pt, line) {
        const [x, y] = line;
        const a = pt[0] - x[0];
        const b = y[0] - x[0];
        const c = pt[1] - x[1];
        const d = y[1] - x[1];

        return 0 > (a * d) - (b * c)
    }

    function circumscribed(A, B, C, D) {
        const [Ax, Ay] = A;
        const [Bx, By] = B;
        const [Cx, Cy] = C;
        const [Dx, Dy] = D;

        const AxDx = Ax - Dx;
        const AyDy = Ay - Dy;

        const BxDx = Bx - Dx;
        const ByDy = By - Dy;

        const CxDx = Cx - Dx;
        const CyDy = Cy - Dy;

        const ADSq = (AxDx * AxDx) + (AyDy * AyDy);
        const BDSq = (BxDx * BxDx) + (ByDy * ByDy);
        const CDSq = (CxDx * CxDx) + (CyDy * CyDy);

        // AxDx, AyDy, ADSq
        // BxDx, ByDy, BDSq
        // CxDx, CyDy, CDSq
        return (AxDx * (ByDy * CDSq - CyDy * BDSq)
            - AyDy * (BxDx * CDSq - BDSq * CxDx)
            + ADSq * (BxDx * CyDy - CxDx * ByDy)) < 0
    }

    function VertexCycle(center) {
        const model = {
            center,
            cycle: LinkedCycle(),
            minPt: null,
        };

        function Center() {
            return model.center
        }

        function First() {
            const first = model.cycle.First();

            return first ? first.val.pt : null
        }

        function SetFirst(pt) {
            const node = model.cycle.Get(pt);
            if (typeof node === 'undefined') throw Error(`pt not found: ${pt}`)

            model.cycle.SetFirst(node);
        }

        function CW(pt) {
            const node = model.cycle.Get(pt);
            if (typeof node === 'undefined') throw Error(`pt not found: ${pt}`)

            return node.prev.val.pt
        }

        function CCW(pt) {
            const node = model.cycle.Get(pt);
            if (typeof node === 'undefined') throw Error(`pt not found: ${pt}`)

            return node.next.val.pt
        }

        function Insert(pt) {
            // prevent duplicates
            if (typeof model.cycle.Get(pt) !== 'undefined') return

            const p = pseudoAngle(ptSub(pt, model.center));

            if (model.cycle.Length() === 0) {
                model.cycle.Append(pt, { pt, p });
                model.minPt = pt;
            } else {
                // find the min point "min" of the cycle
                const min = model.cycle.Get(model.minPt);

                // for the length of the cycle, check next, if p < next -> insert before
                let node = min;
                for (let i = 0; i < model.cycle.Length(); i++) {
                    if (p < node.val.p) break
                    node = node.next;
                }

                model.cycle.InsertBefore(node, pt, { pt, p });

                // if p < min, update min
                if (p < min.val.p) {
                    model.minPt = pt;
                }
            }
        }

        function Remove(pt) {
            const node = model.cycle.Get(pt);
            if (typeof node === 'undefined') throw Error(`pt not found: ${pt}`)

            // are we removing the min?
            if (ptsEq(pt, model.minPt)) {
                model.minPt = model.cycle.Length() === 1 ? null : node.next.val.pt;
            }

            model.cycle.Remove(pt);
        }

        function ToArray() {
            return model.cycle.ToArray().map(({ pt }) => pt)
        }

        return { model, Center, First, CW, CCW, Insert, Remove, SetFirst, ToArray }
    }

    function Triangulate2(adj, A, B) {
        const cycleA = VertexCycle(A);
        cycleA.Insert(B);

        const cycleB = VertexCycle(B);
        cycleB.Insert(A);

        adj[A] = cycleA;
        adj[B] = cycleB;
    }

    function Triangulate3(adj, A, B, C) {
        const cycleA = VertexCycle(A);
        const cycleB = VertexCycle(B);
        const cycleC = VertexCycle(C);

        if (rightOf(C, [A, B])) {
            cycleA.Insert(C);
            cycleA.Insert(B);

            cycleB.Insert(A);
            cycleB.Insert(C);

            cycleC.Insert(B);
            cycleC.Insert(A);
        } else {
            cycleA.Insert(B);
            cycleA.Insert(C);

            cycleB.Insert(C);
            cycleB.Insert(A);

            cycleC.Insert(A);
            cycleC.Insert(B);
        }

        adj[A] = cycleA;
        adj[B] = cycleB;
        adj[C] = cycleC;
    }

    function LowerCommonTangent(adj, X, Y) {
        let $Y = adj[Y].First();
        let X$ = adj[X].CW(adj[X].First());

        while (true) {
            if (rightOf($Y, [X, Y])) {
                let $$Y = adj[$Y].First();
                Y = $Y;
                $Y = $$Y;
            } else if (rightOf(X$, [X, Y])) {
                let X$$ = adj[X$].CW(X);
                X = X$;
                X$ = X$$;
            } else {
                return [X, Y]
            }
        }
    }

    function Merge(adj, L, R) {
        let first = true;

        while (true) {
            // 1. insert lower-tangent
            adj[L].Insert(R);
            adj[R].Insert(L);
            if (first) {
                adj[L].SetFirst(R);
                first = false;
            }

            // 2. get the candidate point from right side
            let rightCandidate = false;
            while (true) {
                const R$ = adj[R].CW(L);

                if (!rightOf(R$, [R, L])) {
                    rightCandidate = false;
                    break
                }

                const R$$ = adj[R].CW(R$);

                if (!circumscribed(R$, L, R, R$$)) {
                    rightCandidate = R$;
                    break
                }

                adj[R].Remove(R$);
                adj[R$].Remove(R);
            }

            // 3. get the candidate point from left side
            let leftCandidate = false;
            while (true) {
                const $L = adj[L].CCW(R);
                if (rightOf($L, [L, R])) {
                    leftCandidate = false;
                    break
                }

                const $$L = adj[L].CCW($L);

                if (!circumscribed($L, L, R, $$L)) {
                    leftCandidate = $L;
                    break
                }

                adj[L].Remove($L);
                adj[$L].Remove(L);
            }

            // 4. No more candidates? done.
            if (!rightCandidate && !leftCandidate) {
                adj[R].SetFirst(L);
                return adj
            }

            if (!leftCandidate) {
                R = rightCandidate;
            } else if (!rightCandidate) {
                L = leftCandidate;
            } else if (circumscribed(leftCandidate, L, R, rightCandidate)) {
                R = rightCandidate;
            } else {
                L = leftCandidate;
            }
        }
    }

    function PointSort (A, B) {
        // if they share same x-coord
        if (A[0] === B[0]) {
            // then A comes before B iff A's y-coord is higher than B's y-coord
            return A[1] > B[1] ? -1 : 1
        }

        // otherwise A comes before B iff A's x-coord is lower than B's y-coord
        return A[0] < B[0] ? -1 : 1
    }

    function Delaunay(pts) {
        // the output will be an adjacency list of edges
        const adj = {};

        // pass edges into the recursive procedure
        delaunay(pts.sort(PointSort), adj, 0, pts.length - 1);

        return adj
    }


    function delaunay(pts, adj, l, r) {
        // how many points are we triangulating
        const size = r - l;

        // zero or 1 point is the trivial delaunay triangulation
        if (size < 1) return

        // 2 points can be computed easily
        if (size === 1) return Triangulate2(adj, pts[l], pts[r])

        // 3 points can be computed easily
        if (size === 2) return Triangulate3(adj, pts[l], pts[l + 1], pts[r])

        // otherwise we divide into halves:
        const m = l + ((r - l) >>> 1);
        const m2 = m + 1;

        delaunay(pts, adj, l, m);
        delaunay(pts, adj, m2, r);

        // and then merge the results
        const [L, R] = LowerCommonTangent(adj, pts[m], pts[m2]);
        Merge(adj, L, R);
    }

    function UniqueEdges(adj) {
        const edges = {};

        Object.keys(adj).forEach(pt => {
            const a = adj[pt].Center();

            adj[pt].ToArray().forEach(b => {
                if (PointSort(a, b) === -1) {
                    edges[[a[0], a[1], b[0], b[1]]] = [a, b];
                } else {
                    edges[[b[0], b[1], a[0], a[1]]] = [b, a];
                }
            });
        });

        return Object.keys(edges).map(key => edges[key])
    }

    exports.default = Delaunay;
    exports.Delaunay = Delaunay;
    exports.UniqueEdges = UniqueEdges;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
