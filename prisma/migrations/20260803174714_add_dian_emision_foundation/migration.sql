-- CreateTable
CREATE TABLE `dian_resoluciones` (
    `id_resolucion_dian` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_razon_social` INTEGER UNSIGNED NOT NULL,
    `tipo_documento` ENUM('FACTURA', 'DOC_SOPORTE') NOT NULL,
    `entorno` VARCHAR(1) NOT NULL,
    `prefijo` VARCHAR(10) NOT NULL,
    `numero_resolucion` VARCHAR(100) NOT NULL,
    `rango_desde` INTEGER UNSIGNED NOT NULL,
    `rango_hasta` INTEGER UNSIGNED NOT NULL,
    `consecutivo_actual` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `fecha_vigencia_desde` DATE NOT NULL,
    `fecha_vigencia_hasta` DATE NOT NULL,
    `clave_tecnica` VARCHAR(255) NOT NULL,
    `activa` BOOLEAN NOT NULL DEFAULT true,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_resoluciones_dian_razon_social`(`id_razon_social`),
    INDEX `idx_resoluciones_dian_tipo_entorno_activa`(`tipo_documento`, `entorno`, `activa`),
    PRIMARY KEY (`id_resolucion_dian`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes_dian` (
    `id_cliente_dian` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(180) NOT NULL,
    `tipo_documento` VARCHAR(5) NOT NULL DEFAULT '13',
    `numero_documento` VARCHAR(30) NOT NULL,
    `direccion` VARCHAR(200) NULL,
    `ciudad` VARCHAR(150) NULL,
    `departamento` VARCHAR(150) NULL,
    `telefono` VARCHAR(30) NULL,
    `email` VARCHAR(191) NULL,
    `tipo_persona` VARCHAR(5) NOT NULL DEFAULT '2',
    `responsabilidad_fiscal` VARCHAR(50) NOT NULL DEFAULT 'R-99-PN',
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_clientes_dian_numero_documento`(`numero_documento`),
    INDEX `idx_clientes_dian_nombre`(`nombre`),
    PRIMARY KEY (`id_cliente_dian`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facturas_electronicas` (
    `id_factura_electronica` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_razon_social` INTEGER UNSIGNED NOT NULL,
    `id_cliente_dian` INTEGER UNSIGNED NOT NULL,
    `id_usuario` INTEGER UNSIGNED NOT NULL,
    `id_resolucion_dian` INTEGER UNSIGNED NOT NULL,
    `prefijo` VARCHAR(10) NOT NULL,
    `consecutivo` INTEGER UNSIGNED NOT NULL,
    `fecha_emision` DATETIME(0) NOT NULL,
    `cufe` VARCHAR(96) NOT NULL,
    `qrcode_data` VARCHAR(500) NULL,
    `xml_content` LONGTEXT NOT NULL,
    `nombre_archivo_xml` VARCHAR(255) NOT NULL,
    `estado_dian` ENUM('PENDIENTE', 'ENVIANDO', 'EN_PROCESO', 'ACEPTADO', 'RECHAZADO', 'ERROR_TECNICO') NOT NULL DEFAULT 'PENDIENTE',
    `track_id` VARCHAR(100) NULL,
    `mensaje_error` TEXT NULL,
    `subtotal` DECIMAL(20, 2) NOT NULL,
    `iva` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `inc_consumo` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `ica` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `total` DECIMAL(20, 2) NOT NULL,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_facturas_electronicas_cufe`(`cufe`),
    INDEX `idx_facturas_electronicas_estado_fecha`(`estado_dian`, `fecha_creacion`),
    INDEX `idx_facturas_electronicas_razon_social`(`id_razon_social`),
    INDEX `idx_facturas_electronicas_cliente`(`id_cliente_dian`),
    UNIQUE INDEX `uq_facturas_electronicas_prefijo_consecutivo`(`prefijo`, `consecutivo`),
    PRIMARY KEY (`id_factura_electronica`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `factura_electronica_items` (
    `id_factura_electronica_item` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_factura_electronica` INTEGER UNSIGNED NOT NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `cantidad` DECIMAL(15, 3) NOT NULL,
    `precio_unitario` DECIMAL(20, 2) NOT NULL,
    `descuento` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `subtotal` DECIMAL(20, 2) NOT NULL,
    `codigo_impuesto_1` VARCHAR(5) NOT NULL DEFAULT '01',
    `valor_impuesto_1` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `codigo_impuesto_2` VARCHAR(5) NULL,
    `valor_impuesto_2` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `codigo_impuesto_3` VARCHAR(5) NULL,
    `valor_impuesto_3` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `total` DECIMAL(20, 2) NOT NULL,

    INDEX `idx_factura_electronica_items_factura`(`id_factura_electronica`),
    PRIMARY KEY (`id_factura_electronica_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos_soporte` (
    `id_documento_soporte` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_razon_social` INTEGER UNSIGNED NOT NULL,
    `prefijo` VARCHAR(10) NOT NULL,
    `consecutivo` INTEGER UNSIGNED NOT NULL,
    `fecha_emision` DATETIME(0) NOT NULL,
    `cuds` VARCHAR(96) NOT NULL,
    `xml_content` LONGTEXT NULL,
    `nombre_archivo_xml` VARCHAR(255) NULL,
    `estado_dian` ENUM('PENDIENTE', 'ENVIANDO', 'EN_PROCESO', 'ACEPTADO', 'RECHAZADO', 'ERROR_TECNICO') NOT NULL DEFAULT 'PENDIENTE',
    `track_id` VARCHAR(100) NULL,
    `mensaje_error` TEXT NULL,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_documentos_soporte_cuds`(`cuds`),
    INDEX `idx_documentos_soporte_razon_social`(`id_razon_social`),
    UNIQUE INDEX `uq_documentos_soporte_prefijo_consecutivo`(`prefijo`, `consecutivo`),
    PRIMARY KEY (`id_documento_soporte`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notas_credito` (
    `id_nota_credito` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_factura_electronica` INTEGER UNSIGNED NOT NULL,
    `prefijo` VARCHAR(10) NOT NULL,
    `consecutivo` INTEGER UNSIGNED NOT NULL,
    `fecha_emision` DATETIME(0) NOT NULL,
    `cude` VARCHAR(96) NOT NULL,
    `concepto_correccion` VARCHAR(5) NOT NULL DEFAULT '2',
    `descripcion_motivo` VARCHAR(255) NULL,
    `xml_content` LONGTEXT NULL,
    `nombre_archivo_xml` VARCHAR(255) NULL,
    `estado_dian` ENUM('PENDIENTE', 'ENVIANDO', 'EN_PROCESO', 'ACEPTADO', 'RECHAZADO', 'ERROR_TECNICO') NOT NULL DEFAULT 'PENDIENTE',
    `track_id` VARCHAR(100) NULL,
    `mensaje_error` TEXT NULL,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_notas_credito_cude`(`cude`),
    INDEX `idx_notas_credito_factura`(`id_factura_electronica`),
    UNIQUE INDEX `uq_notas_credito_prefijo_consecutivo`(`prefijo`, `consecutivo`),
    PRIMARY KEY (`id_nota_credito`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notas_debito` (
    `id_nota_debito` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_factura_electronica` INTEGER UNSIGNED NOT NULL,
    `prefijo` VARCHAR(10) NOT NULL,
    `consecutivo` INTEGER UNSIGNED NOT NULL,
    `fecha_emision` DATETIME(0) NOT NULL,
    `cude` VARCHAR(96) NOT NULL,
    `concepto_correccion` VARCHAR(5) NOT NULL DEFAULT '3',
    `descripcion_motivo` VARCHAR(255) NULL,
    `xml_content` LONGTEXT NULL,
    `nombre_archivo_xml` VARCHAR(255) NULL,
    `estado_dian` ENUM('PENDIENTE', 'ENVIANDO', 'EN_PROCESO', 'ACEPTADO', 'RECHAZADO', 'ERROR_TECNICO') NOT NULL DEFAULT 'PENDIENTE',
    `track_id` VARCHAR(100) NULL,
    `mensaje_error` TEXT NULL,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_notas_debito_cude`(`cude`),
    INDEX `idx_notas_debito_factura`(`id_factura_electronica`),
    UNIQUE INDEX `uq_notas_debito_prefijo_consecutivo`(`prefijo`, `consecutivo`),
    PRIMARY KEY (`id_nota_debito`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dian_document_events` (
    `id_evento_dian` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `document_id` INTEGER UNSIGNED NOT NULL,
    `document_type` VARCHAR(30) NOT NULL,
    `event_type` ENUM('CREADO', 'XML_GENERADO', 'FIRMADO', 'ENVIADO', 'TRACK_ID_RECIBIDO', 'EN_PROCESO', 'ACEPTADO', 'RECHAZADO', 'ERROR_TECNICO', 'RETRY_SCHEDULED') NOT NULL,
    `timestamp` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actor` VARCHAR(150) NULL,
    `metadata_json` TEXT NULL,

    INDEX `idx_eventos_dian_document`(`document_type`, `document_id`),
    PRIMARY KEY (`id_evento_dian`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dian_resoluciones` ADD CONSTRAINT `fk_resoluciones_dian_razones_sociales` FOREIGN KEY (`id_razon_social`) REFERENCES `razones_sociales`(`id_razon_social`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facturas_electronicas` ADD CONSTRAINT `fk_facturas_electronicas_razones_sociales` FOREIGN KEY (`id_razon_social`) REFERENCES `razones_sociales`(`id_razon_social`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facturas_electronicas` ADD CONSTRAINT `fk_facturas_electronicas_clientes_dian` FOREIGN KEY (`id_cliente_dian`) REFERENCES `clientes_dian`(`id_cliente_dian`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facturas_electronicas` ADD CONSTRAINT `fk_facturas_electronicas_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facturas_electronicas` ADD CONSTRAINT `fk_facturas_electronicas_resoluciones_dian` FOREIGN KEY (`id_resolucion_dian`) REFERENCES `dian_resoluciones`(`id_resolucion_dian`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `factura_electronica_items` ADD CONSTRAINT `fk_factura_electronica_items_facturas` FOREIGN KEY (`id_factura_electronica`) REFERENCES `facturas_electronicas`(`id_factura_electronica`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos_soporte` ADD CONSTRAINT `fk_documentos_soporte_razones_sociales` FOREIGN KEY (`id_razon_social`) REFERENCES `razones_sociales`(`id_razon_social`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas_credito` ADD CONSTRAINT `fk_notas_credito_facturas_electronicas` FOREIGN KEY (`id_factura_electronica`) REFERENCES `facturas_electronicas`(`id_factura_electronica`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas_debito` ADD CONSTRAINT `fk_notas_debito_facturas_electronicas` FOREIGN KEY (`id_factura_electronica`) REFERENCES `facturas_electronicas`(`id_factura_electronica`) ON DELETE RESTRICT ON UPDATE CASCADE;
