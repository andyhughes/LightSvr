
docker run -d --name LightSvr -p 3000:3000 -v /Users/andrew/Code/LightSvr/nodeserver:/usr/share/nodeserver nodeserver:0.1 /usr/local/bin/node /usr/share/nodeserver/app.js
