CREATE TABLE `tb_picking_list` (
  `id`          int(11)       NOT NULL AUTO_INCREMENT,
  `tanggal`     date          NOT NULL,
  `no_pesanan`  varchar(255)  NOT NULL,
  `id_produk`   varchar(255)  NOT NULL,
  `size`        varchar(255)  NOT NULL,
  `qty`         int(11)       NOT NULL DEFAULT 1,
  `users`       varchar(255)  NOT NULL,
  `created_at`  timestamp     NULL DEFAULT NULL,
  `updated_at`  timestamp     NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_picking_list` (`no_pesanan`, `id_produk`, `size`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
