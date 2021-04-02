CREATE TABLE ventasstock (
  id INT(11) NOT NULL,
  producto VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  cliente VARCHAR(255) NOT NULL,
  cantidadVendidos INT(11) NOT NULL,
  gananciaBruta DOUBLE(10, 2) NOT NULL,
  gananciaNeta DOUBLE(10, 2) NOT NULL,
  montoVenta DOUBLE(10, 2) NOT NULL,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user4 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE ventasstock
  ADD PRIMARY KEY (id);

ALTER TABLE ventasstock
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;