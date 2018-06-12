FROM node:8

WORKDIR /usr/src/app

COPY yarn.lock .
COPY package.json .

RUN yarn

RUN mkdir -p /images

COPY index.js .

EXPOSE 12013

CMD [ "yarn",  "start" ]
