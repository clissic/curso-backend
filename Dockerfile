# Definimos una imagen base
FROM node

# Creamos una carpeta donde vamos a guardar el proyecto
WORKDIR /app

# Copiar los packages de nuestra carpeta local a la carpeta de operaciones
COPY package*.json ./

# Corremos el comando para instalar dependencias
RUN npm install

# Tomamos el codigo del aplicativo
COPY . .

# Habilitar un puerto que escuche nuestra computadora
EXPOSE 8080

CMD ["npm", "start"]