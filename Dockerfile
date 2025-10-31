FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos do projeto
COPY package*.json ./

# Instala dependências
RUN npm install 

# Copia o restante do projeto
COPY . .

# Expõe a porta da API
EXPOSE 3000

RUN npm install


# Comando padrão ao iniciar o container
CMD ["npm", "start"]

