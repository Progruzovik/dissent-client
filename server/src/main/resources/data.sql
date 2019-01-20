INSERT INTO texture(id, name) VALUES
  (1, 'hull-1-destroyed'),
  (2, 'hull-2-2'),
  (3, 'hull-3-1'),
  (4, 'hull-4-2'),
  (5, 'hull-6-1'),
  (6, 'hull-7-1'),
  (7, 'gun-1'),
  (8, 'gun-2'),
  (9, 'gun-3'),
  (10, 'space'),
  (11, 'asteroid'),
  (12, 'cloud');

INSERT INTO hull(id, name, action_points, strength, width, height, texture_id) VALUES
  (2, 'Trainhauler', 4, 4, 1, 1, 2),
  (3, 'Pointer', 4, 4, 1, 1, 3),
  (4, 'Catfish', 3, 9, 1, 1, 4),
  (6, 'Cheeki-Breeki', 4, 6, 1, 1, 5),
  (7, 'Chrome', 5, 9, 2, 1, 6);

INSERT INTO gun_type(id, name) VALUES
  (1, 'ARTILLERY'),
  (2, 'BEAM'),
  (3, 'SHELL');

INSERT INTO gun(id, name, shot_cost, damage, radius, accuracy, gun_type_id, texture_id) VALUES
  (1, 'SHRAPNEL', 2, 3, 10, 0.66, 3, 7),
  (2, 'ARTILLERY', 2, 3, 12, 0.66, 1, 8),
  (3, 'LASER', 1, 2, 6, 0.8, 2, 9);

INSERT INTO mission(id, name) VALUES
  (1, 'borderPatrol');
