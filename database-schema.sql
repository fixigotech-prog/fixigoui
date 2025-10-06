-- Enhanced Services Schema with Sub-items, Property Sizes, Orders, and Tips

-- Property Types and Sizes
CREATE TABLE property_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL, -- apartment, villa, house, office
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE property_sizes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_type_id INT NOT NULL,
  name VARCHAR(100) NOT NULL, -- 1BHK, 2BHK, 3BHK, Small Office, etc.
  size_range VARCHAR(50), -- "500-800 sqft"
  base_multiplier DECIMAL(3,2) DEFAULT 1.00, -- pricing multiplier
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_type_id) REFERENCES property_types(id)
);

-- Enhanced Services with Sub-items
CREATE TABLE service_sub_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  subcategory_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  duration_minutes INT DEFAULT 60,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
);

-- Service pricing based on property size
CREATE TABLE service_pricing (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_sub_item_id INT NOT NULL,
  property_size_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_sub_item_id) REFERENCES service_sub_items(id),
  FOREIGN KEY (property_size_id) REFERENCES property_sizes(id),
  UNIQUE KEY unique_service_size (service_sub_item_id, property_size_id)
);

-- Enhanced Bookings
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  property_type_id INT NOT NULL,
  property_size_id INT NOT NULL,
  address TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  tip_amount DECIMAL(10,2) DEFAULT 0.00,
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (property_type_id) REFERENCES property_types(id),
  FOREIGN KEY (property_size_id) REFERENCES property_sizes(id)
);

-- Booking Items (services selected in booking)
CREATE TABLE booking_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  service_sub_item_id INT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (service_sub_item_id) REFERENCES service_sub_items(id)
);

-- Orders (created from bookings)
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  professional_id INT,
  status ENUM('created', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'created',
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (professional_id) REFERENCES users(id)
);

-- Tips for professionals
CREATE TABLE tips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  professional_id INT NOT NULL,
  customer_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (professional_id) REFERENCES users(id),
  FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO property_types (name) VALUES 
('apartment'), ('villa'), ('house'), ('office'), ('shop');

INSERT INTO property_sizes (property_type_id, name, size_range, base_multiplier) VALUES 
(1, '1BHK', '300-500 sqft', 1.0),
(1, '2BHK', '500-800 sqft', 1.5),
(1, '3BHK', '800-1200 sqft', 2.0),
(1, '4BHK+', '1200+ sqft', 2.5),
(2, 'Small Villa', '1500-2500 sqft', 3.0),
(2, 'Large Villa', '2500+ sqft', 4.0),
(3, 'Small House', '800-1500 sqft', 2.0),
(3, 'Large House', '1500+ sqft', 3.0),
(4, 'Small Office', '200-500 sqft', 1.2),
(4, 'Medium Office', '500-1000 sqft', 2.0),
(4, 'Large Office', '1000+ sqft', 3.0);