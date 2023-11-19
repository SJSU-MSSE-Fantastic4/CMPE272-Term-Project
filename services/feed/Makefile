docker run \
	-p 3000:3000 \
	-e MONGO_HOST=host.docker.internal \
	-e MONGO_PORT=27017 \
	-e MONGO_USER=root \
	-e MONGO_PASSWORD=root \
	-e MONGO_DB_NAME=feedDB \
	-e AMQP_URL=amqp://host.docker.internal \
	sjkchang/chatwave-feed-service 