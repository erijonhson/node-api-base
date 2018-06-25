FROM node:carbon

WORKDIR /usr/src/app

RUN npm i -g nodemon sequelize-cli

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030
CMD [ "npm", "start", "--production" ]
