FROM nginx:1.11.1

RUN apt-get update && apt-get install -y git && cd /usr/share/nginx/html/ && git clone https://github.com/andyhughes/test1

# docker run --rm -it --name www -p 80:80 -v /Users/andrew/Documents/LegalPMC/website:/usr/share/nginx/html lightdf/testwww
# docker run --name www --rm -p 80:80 lightdf/testwww
