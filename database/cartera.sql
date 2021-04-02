CREATE TABLE cartera (
    id INT(11) NOT NULL,
    dineroEfectivo DOUBLE(10, 2) NOT NULL,
    dineroBanco DOUBLE(10, 2) NOT NULL,
    compraProductos DOUBLE(10, 2) NOT NULL,
    gastosProductos DOUBLE(10, 2) NOT NULL,
    gastosEnvio DOUBLE(10, 2) NOT NULL,
    gastosVarios DOUBLE(10, 2) NOT NULL,
    user_id INT(11),
    CONSTRAINT fk_user2 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE cartera
  ADD PRIMARY KEY (id);

ALTER TABLE cartera
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;