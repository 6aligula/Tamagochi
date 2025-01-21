import { create } from "zustand";
import { Directions, Player, States, TamagotchiSprite } from "../../entities/Player";
import { Animated, Easing } from "react-native";
import { Board } from "../../services/entities/Board";
import { GameStates } from "../../entities/GameStates";

export interface GameState {
  states: GameStates;
  tamagotchis: Player[];
  board: Board | null;
  setGameStates: (gameState: GameStates) => void;
  setBoard: (board: Board | null) => void;
  init: () => void;
  move: (name: string, direction: Directions) => boolean;
  addPlayer: (player: Player) => void;
  addControlPlayer: (name: string | null, controlPlayer: TamagotchiSprite) => void;
  newPlayer: (name: string, x: number, y: number) => void;
}

// Diccionario para determinar offsets (dx/dy) y el eje de animación (x/y) por dirección
const movementConfig = {
  [Directions.Left]:  { dx: -1, dy:  0, axis: "x" },
  [Directions.Right]: { dx:  1, dy:  0, axis: "x" },
  [Directions.Up]:    { dx:  0, dy: -1, axis: "y" },
  [Directions.Down]:  { dx:  0, dy:  1, axis: "y" },
  [Directions.Iddle]: { dx:  0, dy:  0, axis: null },
};

export const GameStore = create<GameState>((set, get) => ({
  states: {
    connected: false,
    players: false,
    board: false,
    start: false,
  },
  tamagotchis: [],
  board: null,

  setGameStates: (gameState: GameStates) => {
    set({ states: gameState });
  },

  setBoard: (board: Board | null) => {
    console.log("Store > setBoard called. board =", board);
    set({ board });
  },

  init: () => {
    console.log("Store > init() called");
    GameStore.getState().newPlayer("player1", 0, 0);
  },

  addPlayer: (player: Player) => {
    set((state) => {
      const newArray = [...state.tamagotchis, player];
      console.log("Store > addPlayer. Now tamagotchis.length:", newArray.length);
      return { tamagotchis: newArray };
    });
  },
  

  addControlPlayer: (name: string | null, controlPlayer: TamagotchiSprite) => {
    const { tamagotchis, states } = get();
    const player = tamagotchis.find((item) => item.name === name);
    if (player !== undefined) {
      player.component = controlPlayer;
      player.component.position.setValue({ x: 0, y: 0 });
      player.state = States.Idle;

      // Si es el primer tamagotchi, marcamos que hay players disponibles
      if (tamagotchis.length === 1) {
        states.players = true;
        GameStore.getState().setGameStates(states);
      }

      // Fuerza el estado Idle para que se vea en posición 0,0
      if (name != null) {
        GameStore.getState().move(name, Directions.Iddle);
      }
    }
  },

  move: (name: string, direction: Directions) => {
    const { tamagotchis, board } = get();
  
    // 1. Verificar que la función move se invoque y con qué dirección
    console.log("Store > move called. Name:", name, "direction:", direction);
  
    const player = tamagotchis.find((item) => item.name === name);
  
    if (!player || !player.component?.sprite.current) {
      console.log("Store > move: Player not found or sprite.current is null");
      return false;
    }
  
    if (player.state === States.Moving) {
      console.log("Store > move: Player is already moving, ignoring.");
      return true;
    }
  
    if (direction === Directions.Iddle) {
      console.log("Store > move: Direction is Iddle; setting player to Idle");
      player.state = States.Idle;
      return true;
    }
  
    const config = movementConfig[direction];
    const { dx, dy, axis } = config;
  
    const nextX = player.posX + dx;
    const nextY = player.posY + dy;

    console.log(
        "Store > move: nextX =", nextX,
        "nextY =", nextY,
        "board.size =", board.size
      );
    
      // Chequea límites
      if (nextX < 0 || nextX >= board.size || nextY < 0 || nextY >= board.size) {
        console.log("Store > move: Next position is out of board limits");
        player.state = States.Idle;
        return true;
      }
  
    if (!board || nextX < 0 || nextX >= board.size || nextY < 0 || nextY >= board.size) {
      console.log("Store > move: Next position is out of board limits");
      player.state = States.Idle;
      return true;
    }
  
    const cellRef = board.board[nextY][nextX].ref;
    if (!cellRef) {
      console.log("Store > move: Cell ref is undefined");
      player.state = States.Idle;
      return true;
    }
  
    console.log("Store > move: Starting animation. Current pos:", player.posX, player.posY, " -> Next pos:", nextX, nextY);
  
    // Iniciamos animación
    player.state = States.Moving;
    player.component.sprite.current.play({
      type: direction,
      fps: 8,
      loop: true
    });
  
    // 2. Medir la celda y animar
    cellRef.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      console.log("Store > move: cellRef.measure =>", { pageX, pageY });
  
      if (axis === null) {
        console.log("Store > move: No axis to animate (iddle).");
        player.state = States.Idle;
        return;
      }
  
      // 3. Iniciar la animación y loguear
      console.log(`Store > move: Animating axis '${axis}' to value:`, axis === "x" ? pageX : pageY);
  
      Animated.timing(player.component!.position[axis], {
        toValue: axis === "x" ? pageX : pageY,
        easing: Easing.ease,
        duration: 600,
        useNativeDriver: true
      }).start(() => {
        // 4. Al finalizar la animación
        console.log("Store > move: Animation finished, updating posX/posY");
        player.state = States.Idle;
        player.posX = nextX;
        player.posY = nextY;
      });
    });
  
    return true;
  },  

  newPlayer: (name: string, x: number, y: number) => {
    console.log("Store > newPlayer called with:", { name, x, y });
    const player: Player = {
      name,
      active: true,
      state: States.No_Connected,
      direction: Directions.Up,
      posX: x,
      posY: y,
      component: null,
    };
    GameStore.getState().addPlayer(player);
  },
}));
