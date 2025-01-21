import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TileProps {
  colIndex: number;
  rowIndex: number;
  value: number;
}

/**
 * Componente de celda.
 * Usamos forwardRef para poder recibir la ref y asignarla
 * en BoardComponent, de modo que podamos medirla luego.
 */
const Tile = forwardRef<View, TileProps>(({ colIndex, rowIndex, value }, ref) => {
  return (
    <View ref={ref} style={styles.cell}>
      <Text style={styles.text}>
        {value}
      </Text>
    </View>
  );
});

export default Tile;

const styles = StyleSheet.create({
  cell: {
    width: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});
