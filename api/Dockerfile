FROM node:8

ENV SOURCES=.
ENV DEST=/usr/crowdai/api
ARG PORT=4000
ENV PORT=$PORT
RUN mkdir -p $DEST
WORKDIR $DEST

COPY $SOURCES/package.json .
COPY $SOURCES/package-lock.json .
RUN npm install

COPY $SOURCES .

# descargamos este helper script para poder hacer la verificación de ready de la base de datos.
RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x wait-for-it.sh

CMD ["npm", "start"]