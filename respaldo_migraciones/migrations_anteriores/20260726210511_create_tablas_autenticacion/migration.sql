-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `cedula` VARCHAR(30) NOT NULL,
    `correo` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `cargo` VARCHAR(100) NULL,
    `ciudad` VARCHAR(100) NULL,
    `casino` VARCHAR(150) NULL,
    `fecha_nacimiento` DATE NULL,
    `telefono` VARCHAR(30) NULL,
    `id_tipo_doc` INTEGER NOT NULL,
    `id_genero` INTEGER NOT NULL,
    `id_rol` INTEGER NOT NULL,
    `codigo_helisa` VARCHAR(50) NULL,
    `cuenta_puc` VARCHAR(50) NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fecha_actualizacion` DATETIME(3) NOT NULL,
    `img_url` VARCHAR(500) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',

    UNIQUE INDEX `uq_usuarios_correo`(`correo`),
    INDEX `idx_usuarios_tipo_documento`(`id_tipo_doc`),
    INDEX `idx_usuarios_genero`(`id_genero`),
    INDEX `idx_usuarios_rol`(`id_rol`),
    INDEX `idx_usuarios_codigo_helisa`(`codigo_helisa`),
    INDEX `idx_usuarios_estado`(`estado`),
    UNIQUE INDEX `uq_usuarios_tipo_documento_cedula`(`id_tipo_doc`, `cedula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(100) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `descripcion` VARCHAR(255) NULL,

    UNIQUE INDEX `uq_roles_nombre`(`nombre_rol`),
    INDEX `idx_roles_estado`(`estado`),
    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_documento` (
    `id_tipo_doc` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_doc` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `uq_tipo_documento_nombre`(`nombre_doc`),
    PRIMARY KEY (`id_tipo_doc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `generos` (
    `id_genero` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_genero` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `uq_generos_nombre`(`nombre_genero`),
    PRIMARY KEY (`id_genero`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_tipo_documento` FOREIGN KEY (`id_tipo_doc`) REFERENCES `tipos_documento`(`id_tipo_doc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_genero` FOREIGN KEY (`id_genero`) REFERENCES `generos`(`id_genero`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;
