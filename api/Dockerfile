# Base stage - setup node and pnpm
FROM node:jod-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm && corepack prepare pnpm@latest --activate && corepack use pnpm@latest
# Dependencies stage - cache and install dependencies
FROM base AS deps
WORKDIR /usr/src/app
## Copy only package files first for better caching
COPY ../pnpm-lock.yaml ../package.json ../pnpm-workspace.yaml ./ 
COPY package.json /api/
## Use mount cache for pnpm store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
# Build stage - compile source code
FROM deps AS build
ARG APP
WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Build dependencies first, then target app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter api build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=api --prod /prod/api
# Production stage - minimal runtime image
FROM base AS production
ARG APP
COPY --chown=node:node --from=build /prod/api /prod/api
WORKDIR /prod/api
USER node
EXPOSE 3000
CMD ["node", "dist/server"]