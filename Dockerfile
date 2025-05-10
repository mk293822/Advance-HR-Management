# Stage 1: Build React App (Frontend)
FROM node:18 AS react-build

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm install

COPY tsconfig.json vite.config.js ./
COPY resources/js resources/js
COPY resources/css resources/css

RUN npm run build



# Copy the rest of the React source code


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
