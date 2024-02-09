FROM node:20.11.0

ARG _WORKDIR=/home/node/whatsapp_api
ARG PORT=3333

WORKDIR ${_WORKDIR}

COPY . ${_WORKDIR}
RUN npm install --legacy-peer-deps

USER node
EXPOSE ${PORT}

CMD npm start