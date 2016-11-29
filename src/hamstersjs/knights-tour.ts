import {hamsters, HamsterClosure} from "Hamsters.js";
import {Params} from "Hamsters.js";

export interface ICoordinate {
    readonly x: number;
    readonly y: number;
}

function knightTours(this: HamsterClosure<{ array: ICoordinate[][], boardSize: number}, number>): void {
    function visitField(field: ICoordinate, n: number, board: number[]): number {
        const moves = [
            { x: -2, y: -1 }, { x: -2, y: 1}, { x: -1, y: -2 }, { x: -1, y: 2 },
            { x: 1, y: -2 }, { x: 1, y: 2}, { x: 2, y: -1 }, { x: 2, y: 1 }
        ];

        if (n === board.length) {
            return 1;
        }

        let result = 0;
        const fieldIndex = field.x * boardSize + field.y;

        board[fieldIndex] = n;

        for (let i = 0; i < moves.length; ++i) {
            const move = moves[i];
            const successor = { x: field.x + move.x, y: field.y + move.y };

            // not outside of board and not yet accessed
            const accessible = successor.x >= 0 && successor.y >= 0 && successor.x < boardSize &&  successor.y < boardSize && board[successor.x * boardSize + successor.y] === 0;

            if (accessible) {
                result += visitField(successor, n + 1, board);
            }
        }

        board[fieldIndex] = 0;

        return result;
    }
    const boardSize = this.params.boardSize;
    const board: number[] = new Array(boardSize * boardSize);
    board.fill(0);

    let results: number = 0;

    for (let i = 0; i < this.params.array.length; ++i) {
        const startPath = this.params.array[i];

        for (let index = 0; index < startPath.length - 1; ++index) {
            const fieldIndex = startPath[index].x * boardSize + startPath[index].y;
            board[fieldIndex] = index + 1;
        }

        results += visitField(startPath[startPath.length - 1], startPath.length, board);
    }
    this.rtn.data.push(results);
}

function computeTours(start: ICoordinate, boardSize: number): PromiseLike<number[]> {
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

    let resolve: (result: number[]) => void;
    let reject: (error: any) => void;

    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    const startFields = computeStartFields();
    const params = {
        array: startFields,
        boardSize
    };

    hamsters.run(params, knightTours, (result: number[]) => resolve(result), hamsters.maxThreads, true);
    return promise;
}

function aggregateTours(results: number[]): PromiseLike<number> {
    let resolve: (result: number) => void;
    let reject: (error: any) => void;

    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    hamsters.run({ array: results }, function (this: HamsterClosure<Params<number>, number>): void {
        const result = this.params.array.reduce((memo, value) => memo + value, 0);
        this.rtn.data.push(result);
    }, function (results: number[]) {
        resolve(results[0]);
    }, 1, true);
    return promise;
}

export function parallelKnightTours(start: ICoordinate, boardSize: number): PromiseLike<number> {
    return computeTours(start, boardSize).then(aggregateTours);
}
