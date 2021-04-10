CREATE TABLE comprobanteCaja (
    id INT(11) NOT NULL,
    producto VARCHAR(150) NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    cliente VARCHAR(150) NOT NULL,
    cantidadVendidos INT(11),
    gananciaBruta DOUBLE(10, 2) NOT NULL,
    gananciaNeta DOUBLE(10, 2) NOT NULL,
    montoVenta DOUBLE(10, 2) NOT NULL,
    montoVentaNeto DOUBLE(10, 2) NOT NULL,
    metodo VARCHAR(50) NOT NULL,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user10 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE comprobanteCaja
  ADD PRIMARY KEY (id);

ALTER TABLE comprobanteCaja
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;