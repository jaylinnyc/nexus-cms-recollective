#!/bin/sh
# Generate config.js from config.template.js using environment variables

# Here envsubst will substitute placeholders from environment variables 
# into a config.js file that your Vue app can load dynamically.
envsubst < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js

# Execute the CMD provided in the Dockerfile (i.e. start Nginx)
exec "$@"
