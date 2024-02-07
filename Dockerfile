FROM node:20.11.0

ARG _WORKDIR=/home/node/app
ARG PORT=3333

# USER root
# RUN apk add git

WORKDIR ${_WORKDIR}

ADD . ${_WORKDIR}
RUN npm install --legacy-peer-deps

USER node
EXPOSE ${PORT}

CMD npm start