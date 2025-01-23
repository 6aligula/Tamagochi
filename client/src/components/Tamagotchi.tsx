import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Alert, Button, View } from 'react-native';
import { Sprites, SpritesMethods } from 'react-native-sprites';
import { GameStore } from '../screens/store/store';
import { PlayerService } from '../services/api/PlayerService';

export interface TamagotchiProps {
  name: string;
  active: boolean;
}

const Tamagotchi = ({ name, active }: TamagotchiProps) => {
  // Se crea un Animated.ValueXY local para compartir con el store
  const [positionAnim] = useState(() => new Animated.ValueXY({ x: 0, y: 0 }));

  // Referencia al sprite para poder invocar métodos como .play()
  const spriteRef = useRef<SpritesMethods | null>(null);

  const addControlPlayer = GameStore((state) => state.addControlPlayer);

  const createPlayer = async () => {
    try {
        // Llama al servicio para crear un jugador
        const newPlayer = await PlayerService.createPlayer();
        Alert.alert('Jugador creado', JSON.stringify(newPlayer));
    } catch (error) {
        Alert.alert('Error', 'No se pudo crear el jugador');
    }
  };

  // Cuando el tamagotchi está "active", notificamos al store que puede controlarlo
  useEffect(() => {
    if (active) {
      addControlPlayer(name, {
        position: positionAnim,
        sprite: spriteRef,
      });
    }
  }, [active]);

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          transform: [
            { translateX: positionAnim.x },
            { translateY: positionAnim.y },
          ],
        },
      ]}
    >
      <Sprites
        ref={spriteRef}
        source={require('../assets/tamagot1.jpg')}
        columns={12}
        rows={8}
        animations={{
          down: { row: 0, startFrame: 9, endFrame: 11 },
          left: { row: 1, startFrame: 9, endFrame: 11 },
          right: { row: 2, startFrame: 9, endFrame: 11 },
          up: { row: 3, startFrame: 9, endFrame: 11 },
          iddle: { row: 0, startFrame: 9, endFrame: 10 },
        }}
      />

            {/* Botón para crear un jugador */}
      <View style={styles.buttonContainer}>
        <Button title="Crear Jugador" onPress={createPlayer} />
      </View>
    </Animated.View>
  );
};

export default Tamagotchi;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  buttonContainer: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 5,
  },
});
