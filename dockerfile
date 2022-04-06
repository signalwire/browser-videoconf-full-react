FROM node:14-alpine
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY ./ ./
RUN yarn install 

RUN mkdir -p /video
COPY ./video/package.json ./video/
COPY ./video/yarn.lock ./video/
COPY ./video ./video
RUN cd video && yarn install && yarn build && cd ..
EXPOSE 5300

CMD ["yarn", "prod"]