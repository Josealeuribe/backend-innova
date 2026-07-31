-- CreateTable
CREATE TABLE `inventarios` (
    `id_inventario` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `foto_serial` VARCHAR(500) NULL,
    `foto_estado` VARCHAR(500) NULL,
    `codigo` VARCHAR(50) NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `serial` VARCHAR(100) NULL,
    `clasificacion` VARCHAR(100) NOT NULL,
    `estado` ENUM('DISPONIBLE', 'EN_USO', 'EN_MANTENIMIENTO', 'DANADO', 'DADO_DE_BAJA') NOT NULL DEFAULT 'DISPONIBLE',
    `estado_registro` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `cantidad` INTEGER UNSIGNED NOT NULL DEFAULT 1,
    `valor` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `id_casino` INTEGER UNSIGNED NOT NULL,
    `id_responsable` INTEGER UNSIGNED NULL,
    `ubicacion_local` VARCHAR(200) NULL,
    `fecha_adquisicion` DATE NULL,
    `observaciones` TEXT NULL,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_inventarios_codigo`(`codigo`),
    UNIQUE INDEX `uq_inventarios_serial`(`serial`),
    INDEX `idx_inventarios_nombre`(`nombre`),
    INDEX `idx_inventarios_serial`(`serial`),
    INDEX `idx_inventarios_clasificacion`(`clasificacion`),
    INDEX `idx_inventarios_estado`(`estado`),
    INDEX `idx_inventarios_estado_registro`(`estado_registro`),
    INDEX `idx_inventarios_casino`(`id_casino`),
    INDEX `idx_inventarios_responsable`(`id_responsable`),
    INDEX `idx_inventarios_fecha_adquisicion`(`fecha_adquisicion`),
    PRIMARY KEY (`id_inventario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inventarios` ADD CONSTRAINT `fk_inventarios_casinos` FOREIGN KEY (`id_casino`) REFERENCES `casinos`(`id_casino`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventarios` ADD CONSTRAINT `fk_inventarios_responsables` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
