import { Board, TileBoard } from "./entities/Board";

export type ElementsMap = {
    x: number,
    y: number
}

export class BoardBuilder {
    private size : number;
    private board : number[][];
    private boardTiles : Board;

    constructor(size: number, elements : ElementsMap[]) {
        this.boardTiles = {
            size: size,
            board: new Array<Array<TileBoard>>(size)
        }

        for (let y = 0 ; y < size; y++) {
            this.boardTiles.board[y] = new Array<TileBoard>(size);
            for (let x = 0 ; x < size; x++) {
                this.boardTiles.board[y][x] = {
                    y, x, value: 0, id: `tile-${y}-${x}`, ref: null
                }
            }
        }
        elements.forEach((item)=> this.boardTiles.board[item.y][item.x].value = 5);

        this.size = size;
        this.board = new Array<Array<number>>(size);
        this.board.fill(new Array(size).fill(0));
        elements.forEach((item)=> this.board[item.y][item.x] = 5);
    }

    public getBoardTiles() {
        return this.boardTiles;
    }

    public getBoard() {
        return this.board;
    }
}