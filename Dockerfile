FROM node:16.14.2-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy over package.json file(s)
COPY package*.json ./

# Install app dependencies
RUN npm run refresh

# Copy over app files
COPY . .

# Expose PORT
EXPOSE 6100

# Start application
CMD [ "npm", "start" ]