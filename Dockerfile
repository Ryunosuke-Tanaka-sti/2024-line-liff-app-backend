ARG NODE_VER

FROM node:${NODE_VER} as base
EXPOSE 3000

FROM node:${NODE_VER} as dev

RUN npm update -g npm
RUN npm i -g @nestjs/cli

WORKDIR /home/node/app

RUN chown -R node:node .

USER node
RUN mkdir node_modules

COPY --chown=node:node ./backend/package.json ./backend/package-lock.json ./
RUN npm install

COPY --chown=node:node ./backend ./

CMD [ "npm", "run", "start:dev" ]


FROM node:${NODE_VER} as builder

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini


FROM base AS production
WORKDIR /home/node/app

RUN apt-get update && apt-get install -y unattended-upgrades \
    && unattended-upgrade -v

USER node

COPY --from=builder /tini /tini
COPY --chown=node:node ./backend/node_modules/ ./node_modules/
COPY --chown=node:node ./backend/dist ./dist/

ENTRYPOINT ["/tini", "--"]
CMD ["node", "dist/main.js"]