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

# Install necessary dependencies for PHP and Laravel
RUN apt-get update && apt-get install -y \
    php-cli \
    php-fpm \
    php-mbstring \
    php-xml \
    php-bcmath \
    curl \
    unzip \
    git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory for Laravel
WORKDIR /var/www

# Copy Laravel project files
COPY ./ /var/www/

# Install Laravel dependencies using Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    composer install --no-dev --optimize-autoloader

# Copy the React build folder into the public folder of Laravel
COPY --from=react-build /app/dist /var/www/public/

# Expose PHP-FPM port
EXPOSE 9000

# Start PHP-FPM server
CMD ["php-fpm"]
