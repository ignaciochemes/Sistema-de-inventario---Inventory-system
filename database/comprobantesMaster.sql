CREATE TABLE comprobantesmaster (
    id INT(11) NOT NULL,
    numeroComprobante VARCHAR(150) NOT NULL,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user9 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE comprobantesmaster
  ADD PRIMARY KEY (id);

ALTER TABLE comprobantesmaster
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;