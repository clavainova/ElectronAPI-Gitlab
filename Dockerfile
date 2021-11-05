FROM node
WORKDIR /root/
COPY . .
RUN apt-get -y install libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1
RUN npm install --save-dev electron
RUN npm install
RUN npm run build
CMD npm start
