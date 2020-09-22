FROM node:12 as node
RUN mkdir -p /app
WORKDIR /app
COPY . /app

RUN yarn
RUN yarn migrate

EXPOSE 9999
CMD [ "yarn","run","start" ]
