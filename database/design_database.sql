CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `balance` int NOT NULL DEFAULT 0,
  `profile_image` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE KEY `email_unique` (`email`)
)

CREATE TABLE `services` (
  `id` CHAR(36) NOT NULL,
  `service_code` VARCHAR(255) NOT NULL,
  `service_name` VARCHAR(255) NOT NULL,
  `service_icon` TEXT,
  `service_tariff` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,

  PRIMARY KEY (`id`)
);

CREATE TABLE `transactions` (
  `id` CHAR(36) NOT NULL,
  `user_id` CHAR(36) NOT NULL,
  `service_id` CHAR(36) NOT NULL,
  `invoice_number` VARCHAR(255) NOT NULL,
  `transaction_type` ENUM('TOPUP', 'PAYMENT') NOT NULL,
  `amount` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,

  PRIMARY KEY (`id`),

  KEY `user_id` (`user_id`),
  KEY `service_id` (`service_id`),

  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE `banners` (
  `id` CHAR(36) NOT NULL,
  `banner_name` VARCHAR(255) NOT NULL,
  `banner_image` TEXT,
  `description` TEXT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,

  PRIMARY KEY (`id`)
);

