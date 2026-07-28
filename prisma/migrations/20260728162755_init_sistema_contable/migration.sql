-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `cedula` VARCHAR(30) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `cargo` VARCHAR(120) NOT NULL,
    `fecha_nacimiento` DATE NOT NULL,
    `telefono` VARCHAR(30) NOT NULL,
    `codigo_helisa` VARCHAR(50) NULL,
    `cuenta_puc` VARCHAR(50) NULL,
    `img_url` VARCHAR(500) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `id_tipo_doc` INTEGER NOT NULL,
    `id_genero` INTEGER NOT NULL,
    `id_rol` INTEGER NOT NULL,
    `id_ciudad` INTEGER NOT NULL,
    `id_casino` INTEGER NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_cedula_key`(`cedula`),
    UNIQUE INDEX `usuarios_correo_key`(`correo`),
    INDEX `usuarios_estado_idx`(`estado`),
    INDEX `usuarios_id_tipo_doc_idx`(`id_tipo_doc`),
    INDEX `usuarios_id_genero_idx`(`id_genero`),
    INDEX `usuarios_id_rol_idx`(`id_rol`),
    INDEX `usuarios_id_ciudad_idx`(`id_ciudad`),
    INDEX `usuarios_id_casino_idx`(`id_casino`),
    INDEX `usuarios_apellido_nombre_idx`(`apellido`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_nombre_rol_key`(`nombre_rol`),
    INDEX `roles_estado_idx`(`estado`),
    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_documento` (
    `id_tipo_doc` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_doc` VARCHAR(50) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tipos_documento_nombre_doc_key`(`nombre_doc`),
    INDEX `tipos_documento_estado_idx`(`estado`),
    PRIMARY KEY (`id_tipo_doc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `generos` (
    `id_genero` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_genero` VARCHAR(50) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `generos_nombre_genero_key`(`nombre_genero`),
    INDEX `generos_estado_idx`(`estado`),
    PRIMARY KEY (`id_genero`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ciudades` (
    `id_ciudad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_ciudad` VARCHAR(100) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ciudades_nombre_ciudad_key`(`nombre_ciudad`),
    INDEX `ciudades_estado_idx`(`estado`),
    PRIMARY KEY (`id_ciudad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `casinos` (
    `id_casino` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_casino` VARCHAR(150) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,

    UNIQUE INDEX `casinos_nombre_casino_key`(`nombre_casino`),
    INDEX `casinos_estado_idx`(`estado`),
    PRIMARY KEY (`id_casino`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_tipo_doc_fkey` FOREIGN KEY (`id_tipo_doc`) REFERENCES `tipos_documento`(`id_tipo_doc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_genero_fkey` FOREIGN KEY (`id_genero`) REFERENCES `generos`(`id_genero`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_ciudad_fkey` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades`(`id_ciudad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_casino_fkey` FOREIGN KEY (`id_casino`) REFERENCES `casinos`(`id_casino`) ON DELETE RESTRICT ON UPDATE CASCADE;
