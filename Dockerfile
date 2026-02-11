FROM node:jod-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build

ARG APP

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store CI=true pnpm install --frozen-lockfile

RUN pnpm --filter ${APP} build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=${APP} --prod /prod/${APP} --legacy

FROM base AS express
ARG APP
COPY --chown=node:node --from=build /prod/${APP} /prod/${APP}
WORKDIR /prod/${APP}
USER node
EXPOSE 3000
CMD ["node", "dist/src/server"]

FROM nginx:alpine AS spa
ARG APP
COPY --chown=node:node --from=build /prod/${APP}/dist /usr/share/nginx/html
COPY apps/frontend/web-app/nginx.conf /etc/nginx/nginx.conf
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]