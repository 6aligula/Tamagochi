# Usa una imagen base de Node.js
FROM node:18

# Crea el directorio de la aplicación
WORKDIR /app

# Copia los # Copia los archivos de configuración necesarios
COPY package*.json tsconfig.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "run", "dev"]