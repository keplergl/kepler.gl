FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git python3 make g++ bash sed

RUN corepack enable && corepack prepare yarn@4.4.0 --activate

# Copy dependency manifests first for better layer caching
COPY package.json yarn.lock .yarnrc.yml ./
COPY --parents src/*/package.json ./
COPY --parents examples/demo-app/package.json examples/demo-app/yarn.lock examples/demo-app/.yarnrc.yml ./

# Skip all postinstall scripts to avoid building the gl native package (GPU headers not available)
RUN yarn config set enableScripts false && \
    yarn install && \
    yarn config set enableScripts true

# Selectively run esbuild postinstall (needed for the correct platform binary)
RUN cd node_modules/esbuild && node install.js

# Now copy the full source
COPY . .

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
