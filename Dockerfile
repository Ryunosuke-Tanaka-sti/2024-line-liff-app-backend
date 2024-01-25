ARG NODE_VER
FROM node:${NODE_VER}

RUN npm update -g npm
RUN npm i -g @nestjs/cli

USER node
WORKDIR /home/node/app

COPY --chown=node:node ./backend .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]