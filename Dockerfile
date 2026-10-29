FROM node:22-alpine
WORKDIR /app
COPY server.js ./
COPY site/ ./site/
# hier landen die gespeicherten Auswahlen (als Docker-Volume, überlebt Updates)
RUN mkdir /data && chown node /data
ARG VERSION=dev
ENV VERSION=$VERSION
USER node
EXPOSE 8080
CMD ["node", "server.js"]
