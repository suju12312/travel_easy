# Travel Easy - Dockerized Node.js Application 🚀

## Overview
Travel Easy is a **Node.js** application containerized with **Docker**. This setup allows for easy deployment, consistent environments, and seamless integration with **MongoDB** using **Docker Compose**.

## Features
- 🐳 **Dockerized Node.js App**
- 📦 **MongoDB Container** for database management
- 🔄 **Docker Compose** to manage multi-container environments
- 🚀 **Simplified Deployment** for consistent environments

## Prerequisites
Ensure you have the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (only for local testing, not needed for running inside Docker)

## Getting Started
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/suju12312/travel_easy.git
cd travel_easy
```

### 2️⃣ Build and Run the Containers
To build and start the containers, run:
```bash
docker-compose up --build
```
This command will:
- Build the Node.js application container
- Set up a MongoDB container
- Start the services as defined in `docker-compose.yml`

### 3️⃣ Access the Application
Once the containers are running, open your browser and visit:
```bash
http://localhost:1000
```

### 4️⃣ Stopping the Containers
To stop the running containers, use:
```bash
docker-compose down
```

## Docker Setup Details
### **Dockerfile** (Node.js App Container)
- Uses **Node.js 16** base image
- Copies `package.json` and installs dependencies
- Copies application files
- Exposes **port 1000**
- Runs the app using `CMD ["node", "server.js"]`

### **docker-compose.yml** (Multi-Container Setup)
- Defines two services: `app` (Node.js) and `mongo` (MongoDB)
- Maps **port 1000** on the host to the container
- Uses a **bridge network** for inter-container communication

## Environment Variables
If needed, create a `.env` file and configure environment variables for database connections, ports, etc.

## Common Docker Commands
| Command | Description |
|---------|-------------|
| `docker-compose up` | Start the containers |
| `docker-compose up -d` | Start in detached mode |
| `docker-compose down` | Stop and remove containers |
| `docker ps` | List running containers |
| `docker logs <container_id>` | View container logs |

## Contributing
Feel free to fork the repository, make improvements, and submit a pull request! 😊

## License
This project is licensed under the **MIT License**.

---
### 🎉 Happy Coding & Enjoy Containerized Travel Easy! 🚀🐳

