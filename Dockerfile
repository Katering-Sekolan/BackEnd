FROM node:18.17.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# Clear npm cache
RUN npm cache clean --force

# Install dependencies
RUN npm install 

# Bundle app source
COPY . .

# Expose port 8000
EXPOSE 8000

# Run app
CMD [ "npm", "start" ]
