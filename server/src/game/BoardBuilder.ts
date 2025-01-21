import { Board } from "./entities/Board";

export class BoardBuilder {
    private board: Board;
    
    constructor() {
        this.board = {
            size: 30,
            elements: []
        }
    }

    public getBoard() : Board {
        return this.board;
    }
}