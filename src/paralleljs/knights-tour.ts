const Parallel = require("paralleljs");

export interface ICoordinate {
    readonly x: number;
    readonly y: number;
}

export interface IKnightTourEnvironment {
    boardSize: number;
    board: number[];
}

export function knightTours(startPath: ICoordinate[], boardSize: number): number {
    const moves = [
        { x: -2, y: -1 }, { x: -2, y: 1}, { x: -1, y: -2 }, { x: -1, y: 2 },
        { x: 1, y: -2 }, { x: 1, y: 2}, { x: 2, y: -1 }, { x: 2, y: 1 }
    ];

    const board: number[] = new Array(boardSize * boardSize);
    board.fill(0);

    const numberOfFields = boardSize * boardSize;
    let results: number = 0;
    const stack: { coordinate: ICoordinate, n: number }[] = startPath.map((pos, index) => ({ coordinate: pos, n: index + 1 }));

    for (let index = 0; index < startPath.length - 1; ++index) {
        const fieldIndex = startPath[index].x * boardSize + startPath[index].y;
        board[fieldIndex] = index + 1;
    }

    while (stack.length > 0) {
        const { coordinate, n } = stack[stack.length - 1];
        const fieldIndex = coordinate.x * boardSize + coordinate.y;

        if (board[fieldIndex] !== 0) {
            // back tracking
            board[fieldIndex] = 0;
            stack.pop(); // remove current value
            continue;
        }

        // entry
        if (n === numberOfFields) {
            ++results;
            stack.pop();
            continue;
        }

        board[fieldIndex] = n!;

        for (let i = 0; i < moves.length; ++i) {
            const move = moves[i];
            const successor = { x: coordinate.x + move.x, y: coordinate.y + move.y };
            // not outside of board and not yet accessed
            const accessible = successor.x >= 0 && successor.y >= 0 && successor.x < boardSize &&  successor.y < boardSize && board[successor.x * boardSize + successor.y] === 0;

            if (accessible) {
                stack.push({ coordinate: successor, n: n + 1 });
            }
        }
    }

    return results;
}

declare const global: { env: { boardSize: number }};

export function parallelJSKnightTours(start: ICoordinate, boardSize: number): PromiseLike<number> {

    function successors(coordinate: ICoordinate) {
        const moves = [
            {x: -2, y: -1}, {x: -2, y: 1}, {x: -1, y: -2}, {x: -1, y: 2},
            {x: 1, y: -2}, {x: 1, y: 2}, {x: 2, y: -1}, {x: 2, y: 1}
        ];
        const result: ICoordinate[] = [];

        for (let i = 0; i < moves.length; ++i) {
            const move = moves[i];
            const successor = {x: coordinate.x + move.x, y: coordinate.y + move.y};
            const accessible = successor.x >= 0 && successor.y >= 0 && successor.x < boardSize && successor.y < boardSize &&
                (successor.x !== start.x || successor.y !== start.y) && (successor.x !== coordinate.x && successor.y !== coordinate.y);
            if (accessible) {
                result.push(successor);
            }
        }

        return result;
    }

    function computeStartFields() {
        const result: ICoordinate[][] = [];
        for (const directSuccessor of successors(start)) {
            for (const indirectSuccessor of successors(directSuccessor)) {
                result.push([start, directSuccessor, indirectSuccessor]);
            }
        }
        return result;
    }

    return new Parallel(computeStartFields(), { env: { boardSize }})
        .require(knightTours)
        .map(function (startField: ICoordinate[]) {
            return knightTours(startField, global.env.boardSize);
        })
        .reduce(function (toursPerRun: number[]) {
            return toursPerRun.reduce((memo, current) => memo + current, 0);
        });

    // The reduce operation needs to wait until the map operation is complete, switches back to the main thread and then
    // a new worker is spawned for each reduce step, e.g. for [1, 2, 3, 4, 5, 6] the three workers with [1, 2], [3, 4], [5, 6]
    // then the sub sequent workers [3, 7] and finally, [10, 11] are spawned...
}
