# Step 1: Use an official Node.js runtime as a parent image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./
# If you're using yarn, you can instead do:
# COPY package.json yarn.lock ./

# Step 4: Install dependencies
# If using npm:
RUN npm install
# If you're using yarn, use:
# RUN yarn install --frozen-lockfile

# Step 5: Bundle the application source inside the Docker image
COPY . .

# Step 6: Build the application if it needs a build step
RUN npm run build

# Step 7: Your application runs on port 3000 by default, expose it
EXPOSE 3000

# Step 8: Define the command to run the app
CMD ["node", "dist/main"]