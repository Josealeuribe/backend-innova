-- CreateTable
CREATE TABLE `modulos` (
    `id_modulo` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `ruta` VARCHAR(200) NULL,
    `icono` VARCHAR(100) NULL,
    `orden` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `visible_menu` BOOLEAN NOT NULL DEFAULT true,
    `id_modulo_padre` INTEGER UNSIGNED NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_modulos_codigo`(`codigo`),
    INDEX `idx_modulos_estado`(`estado`),
    INDEX `idx_modulos_orden`(`orden`),
    INDEX `idx_modulos_padre`(`id_modulo_padre`),
    INDEX `idx_modulos_visible_menu`(`visible_menu`),
    INDEX `idx_modulos_nombre`(`nombre`),
    PRIMARY KEY (`id_modulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `acciones` (
    `id_accion` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(30) NOT NULL,
    `nombre` VARCHAR(80) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_acciones_codigo`(`codigo`),
    INDEX `idx_acciones_estado`(`estado`),
    INDEX `idx_acciones_nombre`(`nombre`),
    PRIMARY KEY (`id_accion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permisos` (
    `id_permiso` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_modulo` INTEGER UNSIGNED NOT NULL,
    `id_accion` INTEGER UNSIGNED NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_permisos_modulo`(`id_modulo`),
    INDEX `idx_permisos_accion`(`id_accion`),
    INDEX `idx_permisos_estado`(`estado`),
    UNIQUE INDEX `uq_permisos_modulo_accion`(`id_modulo`, `id_accion`),
    PRIMARY KEY (`id_permiso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles_permisos` (
    `id_rol` INTEGER UNSIGNED NOT NULL,
    `id_permiso` INTEGER UNSIGNED NOT NULL,
    `permitido` BOOLEAN NOT NULL DEFAULT true,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_roles_permisos_permiso`(`id_permiso`),
    INDEX `idx_roles_permisos_permitido`(`permitido`),
    PRIMARY KEY (`id_rol`, `id_permiso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `modulos` ADD CONSTRAINT `fk_modulos_modulo_padre` FOREIGN KEY (`id_modulo_padre`) REFERENCES `modulos`(`id_modulo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permisos` ADD CONSTRAINT `fk_permisos_modulos` FOREIGN KEY (`id_modulo`) REFERENCES `modulos`(`id_modulo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permisos` ADD CONSTRAINT `fk_permisos_acciones` FOREIGN KEY (`id_accion`) REFERENCES `acciones`(`id_accion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles_permisos` ADD CONSTRAINT `fk_roles_permisos_roles` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles_permisos` ADD CONSTRAINT `fk_roles_permisos_permisos` FOREIGN KEY (`id_permiso`) REFERENCES `permisos`(`id_permiso`) ON DELETE CASCADE ON UPDATE CASCADE;
