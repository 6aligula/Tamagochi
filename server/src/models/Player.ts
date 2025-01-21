import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
    name: string;
    x: number;
    y: number;
    state: string; // Enum opcional
    direction: string; // Enum opcional
}

const playerSchema: Schema = new Schema({
    name: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    state: { type: String, enum: ['Idle', 'Moving', 'Dead'], default: 'Idle' },
    direction: { type: String, enum: ['Up', 'Down', 'Left', 'Right', 'Idle'], default: 'Idle' },
});

export default mongoose.model<IPlayer>('Player', playerSchema);
