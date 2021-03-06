# Delaunay

[![Coverage Status](https://coveralls.io/repos/github/desicochrane/delaunay/badge.svg?branch=master)](https://coveralls.io/github/desicochrane/delaunay?branch=master)

Dependency-free implementation of the divide-and-conquer Delaunay Triangulation algorithm.

# Getting started
1. `npm i @desicochrane/delaunay`
1. import and triangulate your point set:
    ```js
    import Delaunay, {UniqueEdges} from '@desicochrane/delaunay'

    // define your point set
    const pts = [ [1,1], [1,2], [3,4], [4,5] ]
 
    // compute triangulation graph
    const graph = Delaunay(pts)
 
   // get unique edges from graph
   const edges = UniqueEdges(graph)
   ```


# The Algorithm
This package takes a divide-and-conquer approach in the same flavor as merge-sort, the basic idea goes something like:

1. Sort the points left to right
1. Divide the points into halves until point set has size 2 or 3
1. Triangulate the 2 or 3 point sets manually
1. Merge the triangulations together


A sample code of the main routine would look something like this:

```js
function Delaunay(pts) {
    // the output will be an adjacency list of edges
    const edges = {}
    
    // pass edges into the recursive procedure
    delaunay(edges, pts.sort(PointSort), 0, pts.length-1)
    
    return edges
}

function delaunay(edges, pts, min, max) {
    // how many points are we triangulating
    const size = max-min+1
    
    // zero or 1 point is the trivial delaunay triangulation 
    if (size < 1) return edges
    
    // 2 points can be computed easily
    if (size == 2) return Triangulate2(edges, pts[min], pts[max])
    
    // 3 points can be computed easily
    if (size == 3) return Triangulate3(edges, pts[min], pts[min+1], pts[max])
    
    // otherwise we divide into halves:
    const mid = min+((max-min)>>>1)
    
    delaunay(edges, pts, min, mid)
    delaunay(edges, pts, mid+1, max)
    
    // and then merge the results
    return Merge(adj, mid, mid+1)
}
```

What remains then is to specify the subroutines `PointSort`, `Triangulate2`, `Triangulate3`, and `Merge`.

#### PointSort Subroutines
```todo```

#### Triangulate2+3 Subroutines
```todo```

#### Merge Subroutine
```todo```

## Geometry Prerequisites
The implementation depends on the following geometric concepts and properties:

#### PseudoAngle
```todo```

#### RightOf
```todo```

#### Circumscribed
```todo```

#### Convex Hull
```todo```


## Data Structures
The efficiency depends heavily on being able to traverse the triangulation efficiently, to do so we construct a `Vertex Cycle` data structure which is effectively a specialised `Cyclic Linked List`.

#### Cyclic Linked List
```todo```

#### Vertex Cycle
```todo```
