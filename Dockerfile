# our base image

FROM ubuntu:16.04
MAINTAINER Conrad De Peuter <conrad.depeuter@gmail.com>



# get python
RUN apt-get -yqq install python-pip python-dev

# get npm
RUN apt-get -yqq install nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node


# copy our application code
ADD flask-app /opt/flask-app
WORKDIR /opt/flask-app


# fetch app specific deps
RUN npm install
RUN npm run build
RUN pip install -r requirements.txt

# specify the port number the container should expose
EXPOSE 5000

# start app
CMD [ "python", "./app.py" ]