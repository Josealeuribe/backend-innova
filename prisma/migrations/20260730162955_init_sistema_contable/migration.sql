-- CreateTable
CREATE TABLE `paises` (
    `id_pais` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `uq_paises_nombre`(`nombre`),
    PRIMARY KEY (`id_pais`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departamentos` (
    `id_departamentos` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `id_pais` INTEGER UNSIGNED NOT NULL,

    INDEX `idx_departamentos_pais`(`id_pais`),
    INDEX `idx_departamentos_nombre`(`nombre`),
    UNIQUE INDEX `uq_departamentos_pais_nombre`(`id_pais`, `nombre`),
    PRIMARY KEY (`id_departamentos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ciudades` (
    `id_ciudad` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_ciudad` VARCHAR(150) NOT NULL,
    `id_departamentos` INTEGER UNSIGNED NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_ciudades_departamento`(`id_departamentos`),
    INDEX `idx_ciudades_nombre`(`nombre_ciudad`),
    INDEX `idx_ciudades_estado`(`estado`),
    UNIQUE INDEX `uq_ciudades_departamento_nombre`(`id_departamentos`, `nombre_ciudad`),
    PRIMARY KEY (`id_ciudad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id_rol` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_roles_nombre`(`nombre_rol`),
    INDEX `idx_roles_estado`(`estado`),
    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_documento` (
    `id_tipo_doc` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_doc` VARCHAR(50) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_tipos_documento_nombre`(`nombre_doc`),
    INDEX `idx_tipos_documento_estado`(`estado`),
    PRIMARY KEY (`id_tipo_doc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `generos` (
    `id_genero` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_genero` VARCHAR(50) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_generos_nombre`(`nombre_genero`),
    INDEX `idx_generos_estado`(`estado`),
    PRIMARY KEY (`id_genero`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `centros_costos` (
    `id_centro_costo` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codigo_centro_costo` VARCHAR(50) NOT NULL,
    `nombre_centro_costo` VARCHAR(150) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_centros_costos_codigo`(`codigo_centro_costo`),
    INDEX `idx_centros_costos_estado`(`estado`),
    INDEX `idx_centros_costos_nombre`(`nombre_centro_costo`),
    PRIMARY KEY (`id_centro_costo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_persona` (
    `id_tipo_persona` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(30) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_tipos_persona_codigo`(`codigo`),
    UNIQUE INDEX `uq_tipos_persona_nombre`(`nombre`),
    INDEX `idx_tipos_persona_estado`(`estado`),
    INDEX `idx_tipos_persona_nombre`(`nombre`),
    PRIMARY KEY (`id_tipo_persona`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ambientes_dian` (
    `id_ambiente_dian` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(30) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_ambientes_dian_codigo`(`codigo`),
    UNIQUE INDEX `uq_ambientes_dian_nombre`(`nombre`),
    INDEX `idx_ambientes_dian_estado`(`estado`),
    INDEX `idx_ambientes_dian_nombre`(`nombre`),
    PRIMARY KEY (`id_ambiente_dian`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `regimenes` (
    `id_regimen` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(30) NOT NULL,
    `nombre` VARCHAR(120) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_regimenes_codigo`(`codigo`),
    UNIQUE INDEX `uq_regimenes_nombre`(`nombre`),
    INDEX `idx_regimenes_estado`(`estado`),
    INDEX `idx_regimenes_nombre`(`nombre`),
    PRIMARY KEY (`id_regimen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `razones_sociales` (
    `id_razon_social` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nit` VARCHAR(30) NOT NULL,
    `nombre_razon_social` VARCHAR(180) NOT NULL,
    `telefono` VARCHAR(30) NOT NULL,
    `direccion` VARCHAR(200) NOT NULL,
    `codigo_postal` VARCHAR(20) NULL,
    `correo` VARCHAR(191) NOT NULL,
    `id_pais` INTEGER UNSIGNED NOT NULL,
    `id_departamentos` INTEGER UNSIGNED NOT NULL,
    `id_ciudad` INTEGER UNSIGNED NOT NULL,
    `id_tipo_persona` INTEGER UNSIGNED NOT NULL,
    `id_ambiente_dian` INTEGER UNSIGNED NOT NULL,
    `id_regimen` INTEGER UNSIGNED NOT NULL,
    `responsabilidad_fiscal` VARCHAR(120) NOT NULL,
    `contrato_coljuegos` VARCHAR(100) NULL,
    `fecha_inicio_contrato` DATE NULL,
    `fecha_fin_contrato` DATE NULL,
    `software_id` VARCHAR(100) NULL,
    `software_pin` VARCHAR(255) NULL,
    `test_set_id` VARCHAR(150) NULL,
    `clave_tecnica` VARCHAR(255) NULL,
    `numero_resolucion` VARCHAR(100) NULL,
    `prefijo_resolucion` VARCHAR(30) NULL,
    `rango_inicio` VARCHAR(30) NULL,
    `rango_fin` VARCHAR(30) NULL,
    `fecha_inicio_resolucion` DATE NULL,
    `fecha_fin_resolucion` DATE NULL,
    `codigo_helisa` VARCHAR(50) NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_razones_sociales_nit`(`nit`),
    UNIQUE INDEX `uq_razones_sociales_correo`(`correo`),
    INDEX `idx_razones_sociales_estado`(`estado`),
    INDEX `idx_razones_sociales_nombre`(`nombre_razon_social`),
    INDEX `idx_razones_sociales_pais`(`id_pais`),
    INDEX `idx_razones_sociales_departamento`(`id_departamentos`),
    INDEX `idx_razones_sociales_ciudad`(`id_ciudad`),
    INDEX `idx_razones_sociales_tipo_persona`(`id_tipo_persona`),
    INDEX `idx_razones_sociales_ambiente_dian`(`id_ambiente_dian`),
    INDEX `idx_razones_sociales_regimen`(`id_regimen`),
    INDEX `idx_razones_sociales_codigo_helisa`(`codigo_helisa`),
    PRIMARY KEY (`id_razon_social`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `casinos` (
    `id_casino` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre_casino` VARCHAR(150) NOT NULL,
    `codigo_dane` VARCHAR(30) NOT NULL,
    `codigo_establecimiento` VARCHAR(50) NOT NULL,
    `telefono` VARCHAR(30) NOT NULL,
    `direccion` VARCHAR(200) NOT NULL,
    `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    `id_ciudad` INTEGER UNSIGNED NOT NULL,
    `id_centro_costo` INTEGER UNSIGNED NOT NULL,
    `id_razon_social` INTEGER UNSIGNED NOT NULL,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_casinos_nombre`(`nombre_casino`),
    UNIQUE INDEX `uq_casinos_codigo_dane`(`codigo_dane`),
    UNIQUE INDEX `uq_casinos_codigo_establecimiento`(`codigo_establecimiento`),
    INDEX `idx_casinos_estado`(`estado`),
    INDEX `idx_casinos_ciudad`(`id_ciudad`),
    INDEX `idx_casinos_centro_costo`(`id_centro_costo`),
    INDEX `idx_casinos_razon_social`(`id_razon_social`),
    INDEX `idx_casinos_nombre`(`nombre_casino`),
    PRIMARY KEY (`id_casino`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
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
    `id_tipo_doc` INTEGER UNSIGNED NOT NULL,
    `id_genero` INTEGER UNSIGNED NOT NULL,
    `id_rol` INTEGER UNSIGNED NOT NULL,
    `id_ciudad` INTEGER UNSIGNED NOT NULL,
    `id_casino` INTEGER UNSIGNED NOT NULL,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_usuarios_cedula`(`cedula`),
    UNIQUE INDEX `uq_usuarios_correo`(`correo`),
    INDEX `idx_usuarios_estado`(`estado`),
    INDEX `idx_usuarios_tipo_documento`(`id_tipo_doc`),
    INDEX `idx_usuarios_genero`(`id_genero`),
    INDEX `idx_usuarios_rol`(`id_rol`),
    INDEX `idx_usuarios_ciudad`(`id_ciudad`),
    INDEX `idx_usuarios_casino`(`id_casino`),
    INDEX `idx_usuarios_apellido_nombre`(`apellido`, `nombre`),
    INDEX `idx_usuarios_codigo_helisa`(`codigo_helisa`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `departamentos` ADD CONSTRAINT `fk_departamentos_paises` FOREIGN KEY (`id_pais`) REFERENCES `paises`(`id_pais`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ciudades` ADD CONSTRAINT `fk_ciudades_departamentos` FOREIGN KEY (`id_departamentos`) REFERENCES `departamentos`(`id_departamentos`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `razones_sociales` ADD CONSTRAINT `fk_razones_sociales_paises` FOREIGN KEY (`id_pais`) REFERENCES `paises`(`id_pais`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `razones_sociales` ADD CONSTRAINT `fk_razones_sociales_departamentos` FOREIGN KEY (`id_departamentos`) REFERENCES `departamentos`(`id_departamentos`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `razones_sociales` ADD CONSTRAINT `fk_razones_sociales_ciudades` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades`(`id_ciudad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `razones_sociales` ADD CONSTRAINT `fk_razones_sociales_tipos_persona` FOREIGN KEY (`id_tipo_persona`) REFERENCES `tipos_persona`(`id_tipo_persona`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `razones_sociales` ADD CONSTRAINT `fk_razones_sociales_ambientes_dian` FOREIGN KEY (`id_ambiente_dian`) REFERENCES `ambientes_dian`(`id_ambiente_dian`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `razones_sociales` ADD CONSTRAINT `fk_razones_sociales_regimenes` FOREIGN KEY (`id_regimen`) REFERENCES `regimenes`(`id_regimen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `casinos` ADD CONSTRAINT `fk_casinos_ciudades` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades`(`id_ciudad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `casinos` ADD CONSTRAINT `fk_casinos_centros_costos` FOREIGN KEY (`id_centro_costo`) REFERENCES `centros_costos`(`id_centro_costo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `casinos` ADD CONSTRAINT `fk_casinos_razones_sociales` FOREIGN KEY (`id_razon_social`) REFERENCES `razones_sociales`(`id_razon_social`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_tipos_documento` FOREIGN KEY (`id_tipo_doc`) REFERENCES `tipos_documento`(`id_tipo_doc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_generos` FOREIGN KEY (`id_genero`) REFERENCES `generos`(`id_genero`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_ciudades` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades`(`id_ciudad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuarios_casinos` FOREIGN KEY (`id_casino`) REFERENCES `casinos`(`id_casino`) ON DELETE RESTRICT ON UPDATE CASCADE;
