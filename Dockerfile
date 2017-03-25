# our base image

# https://github.com/jupyter/docker-stacks/blob/master/pyspark-notebook/Dockerfile
# https://github.com/prakhar1989/FoodTrucks/blob/master/Dockerfile
# https://hub.docker.com/r/datagovsg/python-spark/~/dockerfile/
# https://github.com/CoorpAcademy/docker-pyspark/blob/master/Dockerfile

FROM ubuntu:16.04
MAINTAINER Conrad De Peuter <conrad.depeuter@gmail.com>

# Spark dependencies
ENV APACHE_SPARK_VERSION 2.1.0
ENV HADOOP_VERSION 2.7

# get python
RUN apt-get -yqq install python-pip python-dev



# get npm
RUN apt-get -yqq install nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node


# copy our application code
ADD flask-app /opt/flask-app
WORKDIR /opt/flask-app


# Mesos dependencies
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv E56151BF && \
    DISTRO=debian && \
    CODENAME=jessie && \
    echo "deb http://repos.mesosphere.io/${DISTRO} ${CODENAME} main" > /etc/apt/sources.list.d/mesosphere.list && \
    apt-get -y update && \
    apt-get --no-install-recommends -y --force-yes install mesos=0.25.0-0.2.70.debian81 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# im guessing editing the python path is gonna mess things up, look here if issues
# Spark and Mesos config
ENV SPARK_HOME /usr/local/spark
ENV PYTHONPATH $SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.10.4-src.zip
ENV MESOS_NATIVE_LIBRARY /usr/local/lib/libmesos.so
ENV SPARK_OPTS --driver-java-options=-Xms1024M --driver-java-options=-Xmx4096M --driver-java-options=-Dlog4j.logLevel=info

# fetch app specific deps
RUN npm install
RUN npm run build
RUN pip install -r requirements.txt

# specify the port number the container should expose
EXPOSE 5000

# start app
CMD [ "python", "./app.py" ]