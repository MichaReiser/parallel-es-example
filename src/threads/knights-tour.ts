import {Pool, Done} from "threads";
import {Job} from "threads";

export interface ICoordinate {
    readonly x: number;
    readonly y: number;
}

export function knightTours({ startPath, boardSize }: {startPath: ICoordinate[], boardSize: number}, done: Done): void{
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

    done(results);
}

export function threadsKnightTours(start: ICoordinate, boardSize: number, pool: Pool): PromiseLike<number> {

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

    let resolve: (value: number) => void;
    let reject: (error: any) => void;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });

    let totalTours = 0;
    pool.run(knightTours)
        .on("done", (job: Job, tours: number) => totalTours += tours)
        .on("finished", () => {
            resolve(totalTours)
        });

    for (const startPath of computeStartFields()) {
        pool.send({ startPath, boardSize });
    }

    return promise;
}
