CREATE TABLE compraStock (
    id INT(11) NOT NULL,
    idProducto INT(11) NOT NULL,
    producto VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    precioCompra DOUBLE(10, 2) NOT NULL,
    precioVenta DOUBLE(10, 2) NOT NULL,
    cantidadVendidos INT(11) NOT NULL,
    gananciaBrutaDeLaVenta DOUBLE(10, 2) NOT NULL,
    gananciaNetaDeLaVenta DOUBLE(10, 2) NOT NULL,
    gastosEnvio DOUBLE(10, 2) NOT NULL,
    gastosVarios DOUBLE(10, 2) NOT NULL,
    cliente VARCHAR(255) NOT NULL,
    user_id INT(11),
    CONSTRAINT fk_user3 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE compraStock
  ADD PRIMARY KEY (id);

ALTER TABLE compraStock
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;