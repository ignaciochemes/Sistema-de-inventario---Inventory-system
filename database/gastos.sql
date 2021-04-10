CREATE TABLE gastos (
    id INT(11) NOT NULL,
    gastosCompras INT(11) NOT NULL,
    gastosVarios INT(11) NOT NULL,
    gastosEnvios INT(1) NOT NULL,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user11 FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE gastos
  ADD PRIMARY KEY (id);

ALTER TABLE gastos
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;