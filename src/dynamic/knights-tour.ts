import parallel from "parallel-es";

export interface ICoordinate {
    readonly x: number;
    readonly y: number;
}

export function knightTours(startPath: ICoordinate[], { boardSize }: { boardSize: number }): number {
    const moves = [
        { x: -2, y: -1 }, { x: -2, y: 1}, { x: -1, y: -2 }, { x: -1, y: 2 },
        { x: 1, y: -2 }, { x: 1, y: 2}, { x: 2, y: -1 }, { x: 2, y: 1 }
    ];

    const board: number[] = new Array(boardSize * boardSize);
    board.fill(0);

    function visitField(field: ICoordinate, n: number): number {
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
                result += visitField(successor, n + 1);
            }
        }

        board[fieldIndex] = 0;

        return result;
    }

    for (let index = 0; index < startPath.length - 1; ++index) {
        const fieldIndex = startPath[index].x * boardSize + startPath[index].y;
        board[fieldIndex] = index + 1;
    }

    return visitField(startPath[startPath.length - 1], startPath.length);
}

export function parallelKnightTours(start: ICoordinate, boardSize: number): PromiseLike<number> {

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

    return parallel
        .from(computeStartFields())
        .inEnvironment({ boardSize })
        .map(knightTours)
        .reduce(0, (memo, count) => memo + count);
}
