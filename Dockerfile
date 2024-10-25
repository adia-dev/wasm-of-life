FROM nginx:alpine

COPY ./index.html /usr/share/nginx/html/index.html
COPY ./patterns.json /usr/share/nginx/html/patterns.json
COPY ./out/ /usr/share/nginx/html/out/
COPY ./js/ /usr/share/nginx/html/js/
COPY ./css/ /usr/share/nginx/html/css/

EXPOSE 8080
EXPOSE 80
