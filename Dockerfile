FROM node:krypton-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
ARG APP
ENV APP=${APP}

ARG ENV
ENV ENV=${ENV}

ARG INFISICAL_EMAIL
ENV INFISICAL_EMAIL=${INFISICAL_EMAIL}

ARG INFISICAL_PASSWORD
ENV INFISICAL_PASSWORD=${INFISICAL_PASSWORD}

ARG INFISICAL_ORGANIZATION_ID
ENV INFISICAL_ORGANIZATION_ID=${INFISICAL_ORGANIZATION_ID}

ARG INFISICAL_API_URL
ENV INFISICAL_API_URL=${INFISICAL_API_URL}

COPY . /usr/src/app
WORKDIR /usr/src/app

# Install Infisical CLI
RUN apt-get update && apt-get install -y bash curl && curl -1sLf \
  'https://artifacts-cli.infisical.com/setup.deb.sh' |  bash \
  &&  apt-get update && apt-get install -y infisical

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm add turbo --global

# Login to Infisical and build (the build script in package.json already calls infisical)
RUN infisical login

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --if-present --filter=${APP} build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --filter=${APP} --prod /prod/${APP} --legacy

FROM base AS express
ARG APP
COPY --chown=node:node --from=build /prod/${APP} /prod/${APP}
WORKDIR /prod/${APP}
USER node
EXPOSE 3000
CMD ["pnpm", "start"]

FROM nginx:alpine AS spa
ARG APP
COPY --chown=nginx:nginx --from=build /prod/${APP}/dist /usr/share/nginx/html
COPY app/nginx.conf /etc/nginx/nginx.conf
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx && \
    chmod -R 755 /var/cache/nginx /var/log/nginx
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]