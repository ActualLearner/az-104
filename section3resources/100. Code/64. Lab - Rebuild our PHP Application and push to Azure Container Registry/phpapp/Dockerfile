# php/Dockerfile
FROM php:8.2-apache

# Enable required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Copy app
COPY . /var/www/html/