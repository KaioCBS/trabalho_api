FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

RUN npm install -g sequelize-cli

COPY . .

EXPOSE 3000

CMD ["npm", "start"]