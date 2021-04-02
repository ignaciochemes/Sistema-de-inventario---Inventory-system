CREATE TABLE proveedores (
    id INT(11) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    apellido VARCHAR(150) NOT NULL,
    empresa VARCHAR(150) NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    deuda DOUBLE(10, 2) NOT NULL,
    activo DOUBLE(10, 2) NOT NULL,
    comprasTotales INT(11) NOT NULL,
    pesosTotales DOUBLE(10, 2) NOT NULL,
    user_id INT(11),
    CONSTRAINT fk_user1 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE proveedores
  ADD PRIMARY KEY (id);

ALTER TABLE proveedores
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;
