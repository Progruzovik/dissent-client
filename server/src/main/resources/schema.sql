CREATE TABLE ship(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20) NOT NULL, speed INT NOT NULL);
CREATE TABLE gun(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL, radius INT NOT NULL,
  cooldown INT NOT NULL, projectileType VARCHAR(30) NOT NULL, shotsCount INT DEFAULT 1, shotDelay INT DEFAULT 0);

INSERT INTO ship VALUES
  (1, 'ship-2-2', 3),
  (2, 'ship-3-1', 4),
  (3, 'ship-4-2', 0);

INSERT INTO gun VALUES
  (1, 'shrapnel', 14, 3, 'shell', 3, 15),
  (2, 'laser', 10, 2, 'beam', 1, 0);