El contenedor de la aplicación `api` está entrando en un bucle de reinicio (`Restarting`), lo que indica que algo está fallando en el proceso de inicio dentro del contenedor. Este problema suele estar relacionado con errores en la configuración o ejecución de la aplicación. Aquí hay pasos para diagnosticar y resolver el problema:

---

### **1. Inspeccionar los Logs del Contenedor**
Ejecuta el siguiente comando para ver los logs del contenedor y obtener más información sobre el error:

```bash
docker logs <container-id>
```

En tu caso:
```bash
docker logs deeaf71c42ea
```

Esto debería mostrar el motivo por el cual el contenedor falla. Busca errores como:
- Problemas de conexión a MongoDB.
- Archivos o rutas que no existen.
- Problemas de dependencias o compilación.

---

### **2. Verifica el Comando de Inicio**
El comando de inicio actual en `docker-compose.yml` es:

```yaml
command: >
  sh -c "npm run build && node dist/index.js"
```

Si `npm run build` falla (por ejemplo, si TypeScript no puede compilar), el contenedor no podrá arrancar. Asegúrate de que:
- El código se compila correctamente en tu máquina local:
  ```bash
  npm run build
  ```
- El archivo `dist/index.js` existe después de la compilación.

---

### **3. Reconstruir el Contenedor**
Si el problema está relacionado con archivos que no se copian correctamente al contenedor, reconstruye el contenedor desde cero:

```bash
docker-compose down --volumes
docker-compose up --build
```

---

### **4. Verificar Conexión a MongoDB**
Si los logs indican que no puede conectarse a MongoDB, asegúrate de que la variable de entorno `MONGODB_URL` esté configurada correctamente en `docker-compose.yml`:

```yaml
environment:
  - MONGODB_URL=mongodb://root:example@mongo:27017/demo
```

Además, revisa que MongoDB está funcionando correctamente ejecutando:

```bash
docker exec -it mongodb mongosh -u root -p example
```

---

### **5. Ejecutar el Contenedor Manualmente**
Si el problema persiste, intenta ejecutar el contenedor manualmente para depurar:
1. Abre un contenedor basado en la imagen de tu app:
   ```bash
   docker run -it --entrypoint=/bin/bash server-app
   ```
2. Dentro del contenedor, verifica los archivos:
   ```bash
   ls /app/dist
   ```
   Asegúrate de que `index.js` esté presente.
3. Ejecuta el comando manualmente:
   ```bash
   node dist/index.js
   ```

---

### **6. Ajustar el `restart`**
En `docker-compose.yml`, puedes temporalmente cambiar la política de reinicio para evitar que el contenedor siga reiniciando:

```yaml
restart: "no"
```

Esto te permitirá acceder al contenedor y depurar directamente:

```bash
docker exec -it api /bin/bash
```

---

### **7. Inspeccionar Configuración en Docker**
Si todo parece estar correcto y el contenedor sigue reiniciando, inspecciona la configuración del contenedor con:

```bash
docker inspect api
```

Busca problemas en las rutas de volúmenes, variables de entorno, o comandos de inicio.

---

### **Conclusión**
1. Inspecciona los logs con `docker logs`.
2. Verifica si el comando `npm run build && node dist/index.js` funciona correctamente.
3. Asegúrate de que la conexión a MongoDB esté configurada correctamente.
4. Si el contenedor sigue fallando, levanta manualmente el contenedor para depurar.

Compárteme los logs o los errores específicos que encuentres, y te ayudaré a resolverlo rápidamente. 🚀