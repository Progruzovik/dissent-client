CREATE TABLE texture(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL);

CREATE TABLE hull(id INT AUTO_INCREMENT PRIMARY KEY, actionPoints INT NOT NULL,
  textureId INT NOT NULL REFERENCES texture(id));
CREATE TABLE gunType(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30));
CREATE TABLE gun(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL, shotCost INT NOT NULL,
  radius INT NOT NULL, gunTypeId INT NOT NULL REFERENCES gunType(id));

INSERT INTO texture VALUES
  (1, 'hull-2-2'),
  (2, 'hull-3-1'),
  (3, 'hull-4-2'),
  (4, 'asteroid'),
  (5, 'cloud');

INSERT INTO hull VALUES
  (1, 4, 1),
  (2, 5, 2),
  (3, 10, 3);

INSERT INTO gunType VALUES
  (1, 'shell'),
  (2, 'beam');

INSERT INTO gun VALUES
  (1, 'shrapnel', 1, 10, 1),
  (2, 'laser', 2, 12, 2);
