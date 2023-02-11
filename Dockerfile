FROM node:19-slim as front
WORKDIR /usr/src/app/front
COPY front/package.json front/tsconfig.json front/yarn.lock ./
RUN yarn
COPY front/ ./
RUN yarn build

FROM node:19-slim as back
WORKDIR /usr/src/app
COPY package.json tsconfig.json yarn.lock ./
RUN yarn
COPY prisma/*ts prisma/schema.prisma prisma/
RUN yarn prisma:gen
COPY server/*ts server/
RUN yarn build
WORKDIR /target
COPY --from=front /usr/src/app/public/* public/
RUN cp -Rapvf /usr/src/app/dist/* . \
 && mkdir -p node_modules \
 && cp -Rapvf /usr/src/app/node_modules/@generated /usr/src/app/node_modules/.prisma node_modules/ \
 && cp /usr/src/app/prisma/schema.prisma prisma/schema.prisma
COPY prisma/migrations prisma/migrations/

FROM node:19-slim as target
ENV DATABASE_URL="file:/data/database.db" \
    NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production && yarn cache clean && mkdir -p /data
COPY --from=back /target/ .

EXPOSE 4000
CMD [ "node", "server/index.js" ]
