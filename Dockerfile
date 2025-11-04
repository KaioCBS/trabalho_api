FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos do projeto
COPY package*.json ./

# Instala dependências
RUN npm install 

# Instala Sequelize CLI globalmente
RUN npm install -g sequelize-cli

# Copia o restante do projeto
COPY . .

# Expõe a porta da API
EXPOSE 3000

# Comando para iniciar a aplicação (APENAS UM CMD)
CMD sh -c "npx sequelize-cli db:migrate && npm start"