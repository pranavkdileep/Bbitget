FROM node:18.13.0

WORKDIR /app

COPY . /app
RUN chmod 777 /app/example.png
RUN chmod 777 /app/Data/data1.json
RUN chmod 777 /app/Data/data2.json
RUN chmod 777 /app/Data/data3.json
RUN chmod 777 /app/Data/data4.json

RUN npm install

CMD ["node", "main"]