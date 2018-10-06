'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function (pts) {
    var adj = {};

    delaunay(pts.sort(_PointSort2.default), adj, 0, pts.length - 1);

    return adj;
};

exports.UniqueEdges = UniqueEdges;

var _Triangulate = require('./Triangulate');

var _LowerCommonTangent3 = require('./LowerCommonTangent');

var _LowerCommonTangent4 = _interopRequireDefault(_LowerCommonTangent3);

var _Merge = require('./Merge');

var _Merge2 = _interopRequireDefault(_Merge);

var _PointSort = require('./PointSort');

var _PointSort2 = _interopRequireDefault(_PointSort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function delaunay(pts, adj, l, r) {
    var size = r - l;

    switch (size) {
        case 0:
            return;
        case 1:
            return (0, _Triangulate.Triangulate2)(adj, pts[l], pts[r]);
        case 2:
            return (0, _Triangulate.Triangulate3)(adj, pts[l], pts[l + 1], pts[r]);
        default:
            var m = l + (r - l >>> 1);
            var m2 = m + 1;

            delaunay(pts, adj, l, m);
            delaunay(pts, adj, m2, r);

            var _LowerCommonTangent = (0, _LowerCommonTangent4.default)(adj, pts[m], pts[m2]),
                _LowerCommonTangent2 = _slicedToArray(_LowerCommonTangent, 2),
                L = _LowerCommonTangent2[0],
                R = _LowerCommonTangent2[1];

            (0, _Merge2.default)(adj, L, R);
    }
}

function UniqueEdges(adj) {
    var edges = {};

    Object.keys(adj).forEach(function (pt) {
        var a = adj[pt].Center();

        adj[pt].ToArray().forEach(function (b) {
            if ((0, _PointSort2.default)(a, b) === -1) {
                edges[[a[0], a[1], b[0], b[1]]] = [a, b];
            } else {
                edges[[b[0], b[1], a[0], a[1]]] = [b, a];
            }
        });
    });

    return Object.keys(edges).map(function (key) {
        return edges[key];
    });
}
