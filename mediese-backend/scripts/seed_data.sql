-- Sample data for testing (optional)
-- Make sure to hash the password properly in your application

INSERT INTO staff_accounts (staff_id, first_name, last_name, email, username, password_hash, role) 
VALUES 
    ('STAFF001', 'John', 'Doe', 'john.doe@mediease.com', 'johndoe', '$2b$10$N9qo8uLOickgx2ZMRZo5i.eW3V3sJY6l2Yy2kZt9hJ4xU8Qd/4G5K', 'admin')
ON CONFLICT (username) DO NOTHING;
