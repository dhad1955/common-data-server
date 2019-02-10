FROM node

RUN mkdir /app
ADD ./src/ /app/src
ADD ./package.json /app
ADD ./package-lock.json /app
ADD ./index.js /app
WORKDIR /app
RUN ls
RUN npm install --production
EXPOSE 3000
CMD node index.js
