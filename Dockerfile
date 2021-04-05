FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package.json yarn.lock ./

FROM build-stage
RUN yarn install
COPY . .
RUN yarn run build
CMD [ "yarn", "run","start:prod" ]


