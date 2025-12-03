FROM node:21-alpine as build-stage


# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
RUN npm ci
# copy source code to /app/src folder
COPY .. /app/
# check files list
RUN npm run build

FROM nginx:1.15
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/

# Copy the default nginx.conf provided by tiangolo/node-frontend
#COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
