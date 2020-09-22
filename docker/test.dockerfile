FROM node:12 as node
RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN yarn
RUN NODE_ENV=test yarn run migrate
RUN  NODE_ENV=test yarn run sequelize db:migrate:undo:all
