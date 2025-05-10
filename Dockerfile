# Stage 1: Build React App (Frontend)
FROM node:18 AS react-build

# Set working directory for React
WORKDIR /app

# Copy React project files
COPY ./package.json ./package-lock.json ./

# Install React dependencies
RUN npm install

# Copy the rest of the React source code
COPY ./resources/js ./

# Build the React app for production
RUN npm run build

# Stage 2: Build Laravel App (Backend)
FROM php:8.3-fpm

# Stage 2: Build Laravel App (Backend)
FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    && docker-php-ext-install mbstring xml bcmath

# Set working directory
WORKDIR /var/www

# Copy Laravel project files
COPY ./ /var/www/

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy React build into Laravel public folder
COPY --from=react-build /app/dist /var/www/public/

# Expose PHP-FPM port
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
