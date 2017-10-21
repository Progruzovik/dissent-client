CREATE TABLE texture(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL);

CREATE TABLE hull(id INT AUTO_INCREMENT PRIMARY KEY,
  speed INT NOT NULL, textureId INT NOT NULL REFERENCES texture(id));
CREATE TABLE gunType(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30));
CREATE TABLE gun(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL, radius INT NOT NULL,
  cooldown INT NOT NULL, gunTypeId INT NOT NULL REFERENCES gunType(id));

INSERT INTO texture VALUES
  (1, 'hull-2-2'),
  (2, 'hull-3-1'),
  (3, 'hull-4-2'),
  (4, 'asteroid'),
  (5, 'cloud');

INSERT INTO hull VALUES
  (1, 3, 1),
  (2, 4, 2),
  (3, 0, 3);

INSERT INTO gunType VALUES
  (1, 'shell'),
  (2, 'beam');

INSERT INTO gun VALUES
  (1, 'shrapnel', 14, 3, 1),
  (2, 'laser', 10, 2, 2);
