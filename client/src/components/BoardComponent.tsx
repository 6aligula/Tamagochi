// BoardComponent.tsx (fragmento)
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Board } from '../services/entities/Board';
import { GameStore } from '../screens/store/store';
import { GameService } from '../services/GameService';
import Tile from './Tile';

const BoardComponent = () => {
  const boardTiles: Board | null = GameStore((state) => state.board);
  const setBoard = GameStore((state) => state.setBoard);

  useEffect(() => {
    // Si no hay board en el store, creamos uno básico de prueba 5x5
    if (!boardTiles) {
      console.log('BoardComponent > No board in store => Creating a 5x5 board');

      const size = 5;
      const newBoard: Board = {
        size,
        // Un array bidimensional con id, x, y, value, ref
        board: Array.from({ length: size }, (_, y) =>
          Array.from({ length: size }, (__ , x) => ({
            id: `cell-${x}-${y}`,
            x,
            y,
            value: 0,
            ref: null,
          }))
        ),
      };

      setBoard(newBoard);

      // Tu lógica de notificar a GameService, etc.
      GameService.getInstance().do({ type: 'BOARD_BUILD', content: '' });
    } else {
      console.log('BoardComponent > Already have a board in store:', boardTiles);
    }
  }, [boardTiles]);

  // Si boardTiles sigue siendo null, regresamos null
  if (!boardTiles) {
    console.log('BoardComponent > boardTiles is still null => returning null');
    return null;
  }

  // Flatten array
  const flattenedData = boardTiles.board.flat();

  return (
    <View style={styles.overlay}>
      <FlatList
        key={`board-${boardTiles.size}`}
        data={flattenedData}
        keyExtractor={(item) => item.id}
        numColumns={boardTiles.size}
        renderItem={({ item }) => (
          <Tile
            ref={(ref) => {
              // Asignamos la ref en la matriz para cellRef.measure(...)
              boardTiles.board[item.y][item.x].ref = ref;
            }}
            colIndex={item.x}
            rowIndex={item.y}
            value={item.value}
          />
        )}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    zIndex: 1,
  },
  grid: {
    padding: 10,
  },
});

export default BoardComponent;
