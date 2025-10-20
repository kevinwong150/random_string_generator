FROM nginx:alpine

# Copy extension files to nginx html directory
COPY manifest.json /usr/share/nginx/html/
COPY popup.html /usr/share/nginx/html/
COPY popup.js /usr/share/nginx/html/
COPY settings.html /usr/share/nginx/html/
COPY settings.js /usr/share/nginx/html/
COPY background.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY icons/ /usr/share/nginx/html/icons/
COPY README.md /usr/share/nginx/html/

# Create a custom nginx config to serve files with correct headers
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index popup.html; \
    location / { \
        add_header Access-Control-Allow-Origin *; \
        try_files $uri $uri/ =404; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
