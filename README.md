<!-- MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=berolegnik@gmail.com
MAIL_PASSWORD=hesw idef ekqa iabr
MAIL_PORT=587
MAIL_ENCRYPTION=STARTTLS

berezhnoioleh@gmail.com
aetm acuc jmer lohx

sitetest544@gmail.com
hfal jera ydaf zsgy -->

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

ALTER TABLE users MODIFY role ENUM('superadmin', 'admin', 'user') NOT NULL DEFAULT 'user';

-- Таблица email_config
CREATE TABLE email_config (
id INT AUTO_INCREMENT PRIMARY KEY,
MAIL_HOST VARCHAR(255) NOT NULL,
MAIL_USERNAME VARCHAR(255) NOT NULL,
MAIL_PASSWORD VARCHAR(255) NOT NULL,
MAIL_PORT INT NOT NULL,
MAIL_ENCRYPTION VARCHAR(50) NOT NULL,
account_name VARCHAR(255) NOT NULL,
user_id INT NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Таблица email_history
CREATE TABLE email_history (
id INT AUTO_INCREMENT PRIMARY KEY,
account_id INT NOT NULL,
recipient_email VARCHAR(255) NOT NULL,
subject VARCHAR(255) NOT NULL,
message TEXT NOT NULL,
attachment_path TEXT,
sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
user_id INT NOT NULL,
FOREIGN KEY (account_id) REFERENCES email_config(id) ON DELETE CASCADE,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
