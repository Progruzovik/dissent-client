CREATE TABLE texture(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL);

CREATE TABLE hull(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL,
  actionPoints INT NOT NULL, strength INT NOT NULL, textureId INT NOT NULL REFERENCES texture(id));
CREATE TABLE gunType(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL);
CREATE TABLE gun(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30) NOT NULL, shotCost INT NOT NULL,
  damage INT NOT NULL, radius INT NOT NULL, gunTypeId INT NOT NULL REFERENCES gunType(id));

INSERT INTO texture(id, name) VALUES
  (1, 'hull-2-2'),
  (2, 'hull-3-1'),
  (3, 'hull-4-2'),
  (4, 'asteroid'),
  (5, 'cloud');

INSERT INTO hull(id, name, actionPoints, strength, textureId) VALUES
  (1, 'Trainhauler', 4, 4, 1),
  (2, 'Pointer', 5, 6, 2),
  (3, 'Catfish', 2, 9, 3);

INSERT INTO gunType(id, name) VALUES
  (1, 'artillery'),
  (2, 'beam'),
  (3, 'shell');

INSERT INTO gun(id, name, shotCost, damage, radius, gunTypeId) VALUES
  (1, 'shrapnel', 1, 2, 6, 3),
  (2, 'artillery', 2, 3, 12, 1),
  (3, 'laser', 2, 3, 9, 2);
