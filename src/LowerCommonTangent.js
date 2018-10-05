import { rightOf } from './Geometry'

export default function(adj, X, Y) {
    let $Y = adj[Y].First()
    let X$ = adj[X].CW(adj[X].First())

    while (true) {
        if (rightOf($Y, [X, Y])) {
            let $$Y = adj[$Y].First()
            Y = $Y
            $Y = $$Y
        } else if (rightOf(X$, [X, Y])) {
            let X$$ = adj[X$].CW(X)
            X = X$
            X$ = X$$
        } else {
            return [X, Y]
        }
    }
}
