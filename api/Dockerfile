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

RUN mkdir public

CMD ["npm", "start"]