CREATE TABLE users (
    userId varchar(40) DEFAULT (uuid()) PRIMARY KEY,
    balance int
);

CREATE TABLE events (
    messageId varchar(40) DEFAULT (uuid()) PRIMARY KEY,
    userId varchar(40),
    type ENUM('credit', 'debit'),
    status ENUM('approved', 'declined'),
    currency varchar(3),
    transaction_amount int,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userId),
    INDEX (userId, status, created_at)
);

CREATE INDEX userId_type_status ON events (userId, type, status);

-- Trigger to update users balance on every approved transaction
DELIMITER $$
CREATE TRIGGER update_account_balance AFTER INSERT ON events
FOR EACH ROW
BEGIN
    UPDATE users
    SET balance = (SELECT SUM(transaction_amount * CASE WHEN type = "credit" THEN 1 ELSE - 1 END) FROM events WHERE userId = NEW.userId AND status = "approved")
    WHERE userId = NEW.userId;
    END $$
DELIMITER
