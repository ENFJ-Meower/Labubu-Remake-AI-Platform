FROM node:current-alpine3.22

WORKDIR /usr/src/app

RUN npm install express jsonwebtoken http-proxy-middleware node-cache

COPY gateway.js ./

EXPOSE 8080

CMD ["node", "gateway.js"]
