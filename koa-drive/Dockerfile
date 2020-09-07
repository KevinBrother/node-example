FROM node

ENV NODE_ENV production

ENV SERVER_PORT 7530

ENV API_PREFIX /api

ENV API_VERSION v1

ENV MONGO_CONNECT_URL mongodb://192.168.1.11:27018/database

ENV POSTGRES_CONNECT_HOST 192.168.1.11

ENV POSTGRES_CONNECT_PORT 5432

RUN mkdir -p /home/NodeServer/dist

WORKDIR /home/NodeServer

COPY ./dist /home/NodeServer/dist

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --production --silent && mv node_modules ../

EXPOSE 7200

CMD npm start