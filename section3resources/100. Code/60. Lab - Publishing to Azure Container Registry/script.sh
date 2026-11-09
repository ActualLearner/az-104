# Log in to your Azure Container Registry (replace with your own values)
sudo docker login <registry-name>.azurecr.io -u <username> -p <password>

# Tag the local image with the ACR path
sudo docker tag phpapp <registry-name>.azurecr.io/phpapp

# Push the image to your ACR
sudo docker push <registry-name>.azurecr.io/phpapp