CREATE TABLE existenciademercaderia (
    id INT(11) NOT NULL,
    numeroComprobante VARCHAR(150) NOT NULL,
    cantidad DOUBLE(10, 2) NOT NULL,
    precioCosto DOUBLE(10, 2) NOT NULL,
    precioVenta DOUBLE(10, 2) NOT NULL,
    article_id INT(11),
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user9 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE existenciademercaderia
  ADD PRIMARY KEY (id);

ALTER TABLE existenciademercaderia
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;