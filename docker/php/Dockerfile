# Use PHP 8.2 FPM
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpq-dev \
    libonig-dev \
    libzip-dev \
    nodejs \
    npm \
    && docker-php-ext-install pcntl pdo pdo_pgsql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Add user matching host UID/GID (passed at build time)
ARG UID=1000
ARG GID=1000
RUN addgroup --gid $GID devgroup \
    && adduser --disabled-password --gecos "" --uid $UID --gid $GID devuser

# Switch to that user
USER devuser

# Set working directory
WORKDIR /var/www/html

# Copy application files (optional for prod, in dev you mount)
COPY . .

EXPOSE 9000
CMD ["php-fpm"]
