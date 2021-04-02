CREATE TABLE categorias (
  id INT(11) NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user5 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE categorias
  ADD PRIMARY KEY (id);

ALTER TABLE categorias
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;