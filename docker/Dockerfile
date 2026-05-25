FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git python3 make g++ bash sed

RUN corepack enable && corepack prepare yarn@4.4.0 --activate

COPY . .

# gl package requires GPU headers only needed for tests; skip build scripts then selectively rebuild esbuild
RUN yarn config set enableScripts false && \
    yarn install && \
    yarn config set enableScripts true

RUN cd node_modules/esbuild && node install.js

RUN yarn fix-dependencies
RUN yarn workspaces foreach -At run stab

WORKDIR /app/examples/demo-app

RUN yarn install
RUN yarn build

FROM node:20-alpine AS runtime

WORKDIR /app

RUN npm install -g serve@14

COPY --from=builder /app/examples/demo-app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
