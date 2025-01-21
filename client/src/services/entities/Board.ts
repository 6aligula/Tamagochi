import { View } from "react-native";

export type TileBoard = {
    id: string
    x: number,
    y: number,
    value: number,
    ref: View | null
}

export interface Board {
    size: number;
    board: Array<Array<TileBoard>>
} 
