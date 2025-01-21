import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Tamagotchi, { TamagotchiProps } from './components/Tamagotchi';
import { GameStore } from './screens/store/store';
import { Directions } from './entities/Player';
import { GameService } from './services/GameService';
import { ClientService } from './services/ClientService';
import BoardComponent from './components/BoardComponent';

const App = () => {
    const initStore = GameStore((state) => state.init);
    const players = GameStore((state) => state.tamagotchis);
    const move = GameStore((state) => state.move);
    
    const movePlayer = (name: String , direction: Directions) => { 
        move(name,direction);
    } 

    useEffect(() => {
        initStore();
        ClientService.getInstance().init("http://localhost:3000");
        GameService.getInstance().init();
        // Dentro de App.tsx, antes del return:
        console.log('Players desde GameStore:', players);

    }, [])
    

    return (
        <SafeAreaView>
            <View style={styles.overlay}>
                <Button title='Derecha' onPress={ ()=> { movePlayer("player1", Directions.Right ) }}/>
                <Button title='Izquierda' onPress={ ()=> { movePlayer("player1", Directions.Left ) }}/>
                <Button title='Arriba' onPress={ ()=> { movePlayer("player1", Directions.Up ) }}/>
                <Button title='Abajo' onPress={ ()=> { movePlayer("player1", Directions.Down ) }}/>
            </View>
            <BoardComponent />
            {/* Render de jugadores */}
      {players.map((item) => (
        <Tamagotchi
          key={item.name} // item.name es string
          name={item.name}
          active={item.active}
        />
      ))}
        </SafeAreaView>
    )
}

export default App

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 500,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        alignItems: "center",
        zIndex: 10
    }
})

