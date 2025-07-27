-- drop drop DATABASE odyssey;
CREATE DATABASE IF NOT EXISTS odyssey;

USE odyssey;

CREATE TABLE IF NOT EXISTS user_data(
    user_id int PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(50), 
    phone VARCHAR(50) NOT NULL,
    dob DATE, 
    street VARCHAR(100), 
    area VARCHAR(50), 
    city VARCHAR(50), 
    pincode INT,
    password VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_data (
    pro_id INT AUTO_INCREMENT PRIMARY KEY,
    pro_name VARCHAR(100),
    pro_description VARCHAR(500),
    fit VARCHAR(50),
    category VARCHAR(100),
    material VARCHAR(100),
    sex ENUM('M',"F","U") NOT NULL,
    price FLOAT,
    rating FLOAT CHECK (rating BETWEEN 0 AND 5),
    total_rating INT,
    image_link VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS specification_data(
    spec_id int AUTO_INCREMENT PRIMARY KEY,
    pro_id int,
    quantity INT, 
    size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL'), 
    FOREIGN KEY (pro_id) REFERENCES product_data(pro_id)
);

CREATE TABLE IF NOT EXISTS cart_data(
    cart_id int AUTO_INCREMENT PRIMARY KEY,
    user_id int,
    pro_id int,
    spec_id int,
    quantity INT,
    price FLOAT,
    FOREIGN KEY (user_id) REFERENCES user_data(user_id),
    FOREIGN KEY (pro_id) REFERENCES product_data(pro_id)
);

CREATE TABLE IF NOT EXISTS order_data(
    order_no int AUTO_INCREMENT PRIMARY KEY,
    user_id int,
    date_of_order DATE,
    total_amt FLOAT,
    mode ENUM('card', 'upi','cash on delivery'),
    payment_status ENUM('payed','not payed'),
    FOREIGN KEY (user_id) REFERENCES user_data(user_id)
);

CREATE TABLE IF NOT EXISTS order_contain_product(
    order_no int,
    pro_id int,
    spec_id int,
    quantity INT,
    price INT,
    PRIMARY KEY(order_no, pro_id),
    FOREIGN KEY (order_no) REFERENCES order_data(order_no),
    FOREIGN KEY (pro_id) REFERENCES product_data(pro_id),
    FOREIGN KEY (spec_id) REFERENCES specification_data(spec_id)
);


