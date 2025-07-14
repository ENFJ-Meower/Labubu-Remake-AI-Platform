FROM node:current-alpine3.22

WORKDIR /usr/src/app

RUN npm install express jsonwebtoken http-proxy-middleware node-cache

COPY gateway.js ./

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:8080/healthz || exit 1

CMD ["node", "gateway.js"]
