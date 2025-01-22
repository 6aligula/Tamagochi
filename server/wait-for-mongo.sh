#!/bin/sh

HOST=${1:-mongo}
PORT=${2:-27017}

echo "Waiting for MongoDB at $HOST:$PORT..."

while ! nc -z $HOST $PORT; do
  sleep 1
done

echo "MongoDB is up!"
exec "$@"
