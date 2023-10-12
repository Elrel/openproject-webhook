# choose base image
FROM 10.10.10.91:5000/node:18.16-slim
# FROM node:18.16.1

# setup working directory
WORKDIR /usr/src/app

# copy project files
COPY . .
COPY .env .env

# install dependencies
RUN yarn install

# expose port
EXPOSE 8030

# command to run the app
CMD ["node", "index.js"]