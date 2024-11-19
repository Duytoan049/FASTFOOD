create database ct313h_grproject character set 'utf8';
use ct313h_grproject;

-- Bảng user
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    user_role INT DEFAULT 0 -- 0 là khách hàng bình thường, 1 là admin, nhân viên
);
select * from user;
-- Bảng customers
CREATE TABLE customers (
    id INT PRIMARY KEY, -- id này là khóa ngoại tham chiếu đến user(id)
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE DEFAULT NULL,   
    address VARCHAR(255) DEFAULT NULL,        
    phone VARCHAR(20) DEFAULT NULL,           
    gender TINYINT(1) DEFAULT NULL,           
	avatar VARCHAR(255) DEFAULT '/public/images/blank-profile-picture.png',         
    FOREIGN KEY (id) REFERENCES user(id) ON DELETE CASCADE -- Tham chiếu đến user(id)
);


-- Bảng products
CREATE TABLE products (
    product_Id INT AUTO_INCREMENT PRIMARY KEY,
    product_Name VARCHAR(255) NOT NULL,
    product_Price INT NOT NULL,
    product_Img VARCHAR(255)
);

-- Bảng orders
CREATE TABLE orders (
    order_Id INT AUTO_INCREMENT PRIMARY KEY,
    id INT,
    order_Date DATETIME default CURRENT_TIMESTAMP,
    total_Price INT NOT NULL,
    FOREIGN KEY (id) REFERENCES user(id) ON DELETE CASCADE -- Tham chiếu đến user(id)
);
select * from orders;
-- Bảng Orderdetail
CREATE TABLE Orderdetail (
    order_Id INT,
    product_Id INT,
    quantity INT,
    price DECIMAL(10, 2),
    PRIMARY KEY (order_Id, product_Id), 
    FOREIGN KEY (order_Id) REFERENCES orders(order_Id) ON DELETE CASCADE, -- Tham chiếu đến orders(order_Id)
    FOREIGN KEY (product_Id) REFERENCES products(product_Id) ON DELETE CASCADE -- Tham chiếu đến products(product_Id)
);

SELECT * FROM Orderdetail WHERE order_Id = 4;
INSERT INTO user (username, password, user_role) VALUES
('john_doe', 'password123', 0),  -- khách hàng bình thường
('admin_user', 'admin123', 1),    -- admin
('employee_1', 'emp123', 0);      -- nhân viên

INSERT INTO customers (id, name, email, address, phone, gender, avatar) VALUES
(1, 'John Doe', 'john_doe@example.com', '123 Main St, Springfield', '1234567890', 1, '/public/images/blank-profile-picture.png'),
(2, 'Jane Smith', 'jane_smith@example.com', '456 Elm St, Springfield', '0987654321', 0, '/public/images/blank-profile-picture.png'),
(3, 'Mark Johnson', 'mark_johnson@example.com', '789 Oak St, Springfield', '1122334455', 1, '/public/images/blank-profile-picture.png');

INSERT INTO products (product_Name, product_Price, product_Img) VALUES
('Pizza cơ bản', 95000, '/public/images/image1.png'),
('Pizza hải sản', 125000, '/public/images/image2.png'),
('Pizza bò', 125000, '/public/images/image3.png'),
('Gà rán', 35000, '/public/images/image9.png'),
('Khoai tây chiên', 25000, '/public/images/image7.png'),
('Burger tôm', 75000, '/public/images/image4.png'),
('Burger bò', 75000, '/public/images/image5.png'),
('Burger đặc biệt', 105000, '/public/images/image8.png'),
('Bánh cuộn', 85000, '/public/images/image6.png'),
('Combo 1', 145000, '/public/images/image10.png'),
('Mì ý', 45000, '/public/images/image11.png'),
('Sandwich thường', 55000, '/public/images/image13.png'),
('Sandwich đặc biệt', 65000, '/public/images/image12.png');


INSERT INTO orders (Id, total_Price) VALUES 
(1, 45000),  -- Tổng giá trị các sản phẩm sẽ được tính ở bảng OrderDetail
(2, 80000),  -- Tổng giá trị sẽ được tính tương ứng
(1, 120000); -- Tổng giá trị sẽ được tính tương ứng
select * from Orderdetail;
INSERT INTO Orderdetail (order_Id, product_Id, quantity, price) VALUES 
(1, 1, 1, 15000),  -- 1 Salad
(1, 3, 2, 50000),  -- 2 Burgers
(2, 2, 1, 30000),  -- 1 Sushi
(2, 5, 1, 70000),  -- 1 Pizza
(3, 4, 3, 60000);  -- 3 Pastas

