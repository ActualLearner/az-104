# Build the Docker image
sudo docker build -t phpapp .

# Run the container (removes after exit)
sudo docker run --rm -p 80:80 phpapp