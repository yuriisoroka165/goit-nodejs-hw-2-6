FROM node

WORKDIR /application

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "server"]