CREATE TABLE articulos (
    id INT(11) NOT NULL,
    producto VARCHAR(150) NOT NULL,
    categoria VARCHAR(150) NOT NULL,
    precioVenta VARCHAR(150) NOT NULL,
    precioCosto VARCHAR(150) NOT NULL,
    proveedor DOUBLE(10, 2) NOT NULL,
    user_id INT(11),
    CONSTRAINT fk_user6 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE articulos
  ADD PRIMARY KEY (id);

ALTER TABLE articulos
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;