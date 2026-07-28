-- AlterTable
ALTER TABLE `casinos` ADD COLUMN `codigo_dane` VARCHAR(30) NULL,
    ADD COLUMN `codigo_establecimiento` VARCHAR(50) NULL,
    ADD COLUMN `direccion` VARCHAR(200) NULL,
    ADD COLUMN `id_centro_costo` INTEGER NULL,
    ADD COLUMN `id_ciudad` INTEGER NULL,
    ADD COLUMN `id_razon_social` INTEGER NULL,
    ADD COLUMN `telefono` VARCHAR(30) NULL,
    MODIFY `fecha_actualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `ciudades` MODIFY `fecha_actualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `generos` MODIFY `fecha_actualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `roles` MODIFY `fecha_actualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `tipos_documento` MODIFY `fecha_actualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `usuarios` MODIFY `fecha_actualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `centros_costos` (
    `id_centro_costo` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_centro_costo` VARCHAR(50) NOT NULL,
    `nombre_centro_costo` VARCHAR(150) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `centros_costos_codigo_centro_costo_key`(`codigo_centro_costo`),
    INDEX `centros_costos_estado_idx`(`estado`),
    INDEX `centros_costos_nombre_centro_costo_idx`(`nombre_centro_costo`),
    PRIMARY KEY (`id_centro_costo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `razones_sociales` (
    `id_razon_social` INTEGER NOT NULL AUTO_INCREMENT,
    `nit` VARCHAR(30) NOT NULL,
    `nombre_razon_social` VARCHAR(180) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `razones_sociales_nit_key`(`nit`),
    INDEX `razones_sociales_estado_idx`(`estado`),
    INDEX `razones_sociales_nombre_razon_social_idx`(`nombre_razon_social`),
    PRIMARY KEY (`id_razon_social`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert defaults for existing foreign keys
INSERT IGNORE INTO `ciudades` (`id_ciudad`, `nombre_ciudad`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES (1, 'MEDELLÍN', 'ACTIVO', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `centros_costos` (`id_centro_costo`, `codigo_centro_costo`, `nombre_centro_costo`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES (1, 'CC-001', 'Centro Costo Principal', 'ACTIVO', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));
INSERT INTO `razones_sociales` (`id_razon_social`, `nit`, `nombre_razon_social`, `estado`, `fecha_creacion`, `fecha_actualizacion`) VALUES (1, '900.123.456-1', 'Razon Social Principal S.A.S.', 'ACTIVO', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- Update existing casinos
UPDATE `casinos` SET `codigo_dane` = CONCAT('DANE-TMP-', `id_casino`), `codigo_establecimiento` = CONCAT('EST-TMP-', `id_casino`), `direccion` = 'Por actualizar', `telefono` = '0000000000', `id_centro_costo` = 1, `id_ciudad` = 1, `id_razon_social` = 1 WHERE `codigo_dane` IS NULL;

-- Make columns NOT NULL
ALTER TABLE `casinos` MODIFY `codigo_dane` VARCHAR(30) NOT NULL,
    MODIFY `codigo_establecimiento` VARCHAR(50) NOT NULL,
    MODIFY `direccion` VARCHAR(200) NOT NULL,
    MODIFY `id_centro_costo` INTEGER NOT NULL,
    MODIFY `id_ciudad` INTEGER NOT NULL,
    MODIFY `id_razon_social` INTEGER NOT NULL,
    MODIFY `telefono` VARCHAR(30) NOT NULL;

-- Create Unique Constraints
CREATE UNIQUE INDEX `casinos_codigo_dane_key` ON `casinos`(`codigo_dane`);
CREATE UNIQUE INDEX `casinos_codigo_establecimiento_key` ON `casinos`(`codigo_establecimiento`);

-- CreateIndex
CREATE INDEX `casinos_id_ciudad_idx` ON `casinos`(`id_ciudad`);

-- CreateIndex
CREATE INDEX `casinos_id_centro_costo_idx` ON `casinos`(`id_centro_costo`);

-- CreateIndex
CREATE INDEX `casinos_id_razon_social_idx` ON `casinos`(`id_razon_social`);

-- CreateIndex
CREATE INDEX `casinos_nombre_casino_idx` ON `casinos`(`nombre_casino`);

-- AddForeignKey
ALTER TABLE `casinos` ADD CONSTRAINT `casinos_id_ciudad_fkey` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades`(`id_ciudad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `casinos` ADD CONSTRAINT `casinos_id_centro_costo_fkey` FOREIGN KEY (`id_centro_costo`) REFERENCES `centros_costos`(`id_centro_costo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `casinos` ADD CONSTRAINT `casinos_id_razon_social_fkey` FOREIGN KEY (`id_razon_social`) REFERENCES `razones_sociales`(`id_razon_social`) ON DELETE RESTRICT ON UPDATE CASCADE;
