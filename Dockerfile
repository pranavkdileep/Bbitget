FROM node:18.13.0

RUN apt-get update && apt-get install -y wget gnupg ca-certificates
RUN apt-get install -y python3 make gcc g++ 

# Install google-chrome-stable
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Create a user with name 'app' and group that will be used to run the app


WORKDIR /app

# Copy and setup your project 

COPY package.json /app/package.json



RUN yarn install 
RUN npm install

COPY . /app


EXPOSE 7860



CMD ["npm", "start"]