FROM ubuntu:22.04

# Install Java and Node.js
RUN apt-get update && apt-get install -y \
    openjdk-17-jre-headless \
    curl \
    && curl -sL https://nodesource.com | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy files
COPY package*.json ./
COPY index.js ./

# Install packages and run
RUN npm install
EXPOSE 3000
EXPOSE 19132

CMD ["node", "index.js"]
