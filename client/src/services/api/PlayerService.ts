import axios from 'axios';

// URL base de tu servidor
const API_URL = 'http://192.168.1.186:3000/players';

export const PlayerService = {
    createPlayer: async () => {
        try {
            // Datos del jugador (harcodeados para la prueba)
            const playerData = {
                name: 'Player2',
                x: 5,
                y: 10,
                state: 'pepe',
                direction: 'Up',
            };

            // Petición POST a la API
            const response = await axios.post(`${API_URL}/create`, playerData);

            // Devuelve la respuesta del servidor
            return response.data;
        } catch (error) {
            console.error('Error creando el jugador:', error);
            throw error;
        }
    },
};
