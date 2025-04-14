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

CREATE TABLE email_config (
id INT AUTO_INCREMENT PRIMARY KEY,
MAIL_HOST VARCHAR(255),
MAIL_USERNAME VARCHAR(255),
MAIL_PASSWORD VARCHAR(255),
MAIL_PORT INT,
MAIL_ENCRYPTION VARCHAR(50),
account_name VARCHAR(255),
user_id INT,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE email_history (
id INT AUTO_INCREMENT PRIMARY KEY,
account_id INT NOT NULL,
recipient_email VARCHAR(255) NOT NULL,
subject VARCHAR(255) NOT NULL,
message TEXT NOT NULL,
attachment_path VARCHAR(255) DEFAULT NULL,
sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
user_id INT,
FOREIGN KEY (account_id) REFERENCES email_config(id) ON DELETE CASCADE,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE email_history (
id INT AUTO_INCREMENT PRIMARY KEY,
account_id INT NOT NULL,
recipient_email VARCHAR(255) NOT NULL,
subject VARCHAR(255) NOT NULL,
message TEXT NOT NULL,
attachment_path TEXT,
sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
user_id INT NOT NULL, -- обязательное поле user_id
FOREIGN KEY (account_id) REFERENCES email_config(id),
FOREIGN KEY (user_id) REFERENCES users(id) -- если есть таблица users
);
