import { GameStore } from "../screens/store/store";
import React, { useState } from 'react'
import { BoardSet, Message, NewPlayerSet, operations } from "./entities/Message";
import { BoardBuilder } from "./BoardBuilder";
import { Board } from "./entities/Board";
import { GameStates } from "../entities/GameStates";
import { Directions, Player } from "../entities/Player";

export class GameService {
    private actions: Record<operations, any> = {
        "NEW_PLAYER": this.action_newPlayer,
        "BOARD_SET": this.action_boardSet,
        "START_GAME": this.action_startGame,
        "PLACE_PLAYERS": this.action_internal_placePlayers,
        "CONNECTED": this.action_connected,
        "BOARD_BUILD": this.action_buildBoard
    }

    private static instance: GameService;
    private unsub : any;

    private constructor() {

        this.unsub = GameStore.subscribe(
            ((state) => {
                if (Object.values(state.states).every((value) => Boolean(value))) {
                    this.action_internal_placePlayers();
                }
            }
        ));        
    };

    static getInstance(): GameService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GameService();
        return this.instance;
    }

    public init() {
        //this.numPlayers = 0;
        //this.board = null;
    }

    public do(data: Message) {
        this.actions[data.type as operations](data.content);
    }

    private action_connected() {
        const states = GameStore.getState().states;
        states.connected = true;
        GameStore.getState().setGameStates(states);
    }

    private action_buildBoard() {
        const states = GameStore.getState().states;
        states.board = true;
        GameStore.getState().setGameStates(states);
    }

    private action_newPlayer(data: NewPlayerSet) {
        const newPlayer = GameStore.getState().newPlayer;
        newPlayer(data.name, data.x, data.y);
    }

    private action_boardSet(data: BoardSet) {
        const boardBuilder = new BoardBuilder(data.size, data.elements);
        const changeBoard = GameStore.getState().setBoard;
        changeBoard(boardBuilder.getBoardTiles());
    }

    private action_startGame() {
        const states = GameStore.getState().states;
        states.start = true;
        GameStore.getState().setGameStates(states);
    }

    public action_internal_placePlayers() {
        const tamagotchis = GameStore.getState().tamagotchis;
        tamagotchis.forEach((item) => {
            const boardTiles: Board | null = GameStore.getState().board;
            if (boardTiles != null) {
                const obj = boardTiles.board[item.posY][item.posX].ref;
                if (obj) {
                    obj.measure((x, y, width, height, pageX, pageY) => {
                        item.component?.position.setValue( {x: pageX , y: pageY} )
                    });
                }
            }
        })
    }
}