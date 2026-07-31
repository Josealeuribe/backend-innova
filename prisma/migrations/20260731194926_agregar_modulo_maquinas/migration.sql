-- CreateTable
CREATE TABLE `tipos_maquina` (
    `id_tipo_maquina` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NOT NULL,
    `nombre` VARCHAR(120) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_tipos_maquina_codigo`(`codigo`),
    UNIQUE INDEX `uq_tipos_maquina_nombre`(`nombre`),
    INDEX `idx_tipos_maquina_estado`(`estado`),
    INDEX `idx_tipos_maquina_nombre`(`nombre`),
    PRIMARY KEY (`id_tipo_maquina`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maquinas` (
    `id_maquina` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_inventario` INTEGER UNSIGNED NOT NULL,
    `id_casino` INTEGER UNSIGNED NOT NULL,
    `id_pais` INTEGER UNSIGNED NOT NULL,
    `id_tipo_maquina` INTEGER UNSIGNED NOT NULL,
    `serial` VARCHAR(100) NOT NULL,
    `numero_interno` VARCHAR(50) NOT NULL,
    `nuc` VARCHAR(100) NOT NULL,
    `nuid` VARCHAR(100) NOT NULL,
    `marca` VARCHAR(100) NOT NULL,
    `modelo` VARCHAR(100) NOT NULL,
    `fecha_fabricacion` DATE NOT NULL,
    `frecuencia_mantenimiento` INTEGER UNSIGNED NOT NULL,
    `ultimo_mantenimiento` DATE NULL,
    `img_documento_legal` VARCHAR(500) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_maquinas_inventario`(`id_inventario`),
    UNIQUE INDEX `uq_maquinas_serial`(`serial`),
    UNIQUE INDEX `uq_maquinas_numero_interno`(`numero_interno`),
    UNIQUE INDEX `uq_maquinas_nuc`(`nuc`),
    UNIQUE INDEX `uq_maquinas_nuid`(`nuid`),
    INDEX `idx_maquinas_estado`(`estado`),
    INDEX `idx_maquinas_casino`(`id_casino`),
    INDEX `idx_maquinas_pais`(`id_pais`),
    INDEX `idx_maquinas_tipo`(`id_tipo_maquina`),
    INDEX `idx_maquinas_marca`(`marca`),
    INDEX `idx_maquinas_modelo`(`modelo`),
    INDEX `idx_maquinas_fecha_fabricacion`(`fecha_fabricacion`),
    INDEX `idx_maquinas_ultimo_mantenimiento`(`ultimo_mantenimiento`),
    PRIMARY KEY (`id_maquina`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `maquinas` ADD CONSTRAINT `fk_maquinas_inventarios` FOREIGN KEY (`id_inventario`) REFERENCES `inventarios`(`id_inventario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maquinas` ADD CONSTRAINT `fk_maquinas_casinos` FOREIGN KEY (`id_casino`) REFERENCES `casinos`(`id_casino`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maquinas` ADD CONSTRAINT `fk_maquinas_paises` FOREIGN KEY (`id_pais`) REFERENCES `paises`(`id_pais`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maquinas` ADD CONSTRAINT `fk_maquinas_tipos_maquina` FOREIGN KEY (`id_tipo_maquina`) REFERENCES `tipos_maquina`(`id_tipo_maquina`) ON DELETE RESTRICT ON UPDATE CASCADE;
