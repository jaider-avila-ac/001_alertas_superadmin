# superadmin en dos etapas: se compila con node y se sirve con nginx sin root
# se fijan al construir: VITE_API_URL (el backend) y VITE_URL_FRONT (el front de los colegios,
# para mostrar el enlace de cada institucion)

# ---- compilar ----
FROM node:22-alpine AS compilar
WORKDIR /app
ARG VITE_API_URL
ARG VITE_URL_FRONT
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_URL_FRONT=$VITE_URL_FRONT

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN test -n "$VITE_API_URL" || (echo "Falta VITE_API_URL" && exit 1)
RUN test -n "$VITE_URL_FRONT" || (echo "Falta VITE_URL_FRONT" && exit 1)
RUN npm run build

# ---- servir ----
FROM nginxinc/nginx-unprivileged:1.27-alpine
ARG VITE_API_URL

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY seguridad.inc /etc/nginx/conf.d/seguridad.inc
# la csp solo deja hablar con ese backend (https -> wss para el websocket)
USER root
RUN WS=$(echo "$VITE_API_URL" | sed 's#^http#ws#') \
    && sed -i "s#__API__#$VITE_API_URL#; s#__WS__#$WS#" /etc/nginx/conf.d/seguridad.inc
USER nginx

COPY --from=compilar /app/dist /usr/share/nginx/html
EXPOSE 8080
