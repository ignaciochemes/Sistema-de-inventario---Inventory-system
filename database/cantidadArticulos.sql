CREATE TABLE cantidadArticulos (
    id INT(11) NOT NULL,
    totalArticulos VARCHAR(150) NOT NULL,
    user_id INT(11),
    CONSTRAINT fk_user7 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE cantidadArticulos
  ADD PRIMARY KEY (id);

ALTER TABLE cantidadArticulos
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;