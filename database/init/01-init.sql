-- Initialize Database
-- This script will run when the MySQL container starts for the first time

-- Set character set and collation
ALTER DATABASE mat_nice_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create application user (if not using root)
-- CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'your_password_here';
-- GRANT ALL PRIVILEGES ON matnice_ecommerce.* TO 'appuser'@'%';
-- FLUSH PRIVILEGES;

-- Set timezone
SET time_zone = '+07:00';

-- Enable event scheduler (if needed for cleanup tasks)
SET GLOBAL event_scheduler = ON;
