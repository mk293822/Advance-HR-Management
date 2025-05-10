FROM node:20 AS react-build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy config files
COPY tsconfig.json vite.config.js ./

# Copy source code (including CSS!)
COPY resources/js resources/js
COPY resources/css resources/css

# Build React app
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

RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

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

# After copying files
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Expose PHP-FPM port
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]
