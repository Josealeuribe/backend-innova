-- CreateTable
CREATE TABLE `documentos_recibidos` (
    `id_documento_recibido` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_razon_social` INTEGER UNSIGNED NOT NULL,
    `id_casino` INTEGER UNSIGNED NULL,
    `cufe` VARCHAR(96) NULL,
    `tipo_documento` ENUM('FACTURA', 'NOTA_CREDITO', 'NOTA_DEBITO') NOT NULL,
    `prefijo` VARCHAR(10) NULL,
    `consecutivo` VARCHAR(30) NULL,
    `numero_documento_completo` VARCHAR(60) NOT NULL,
    `nit_emisor` VARCHAR(30) NOT NULL,
    `nombre_emisor` VARCHAR(180) NOT NULL,
    `fecha_emision` DATETIME(0) NOT NULL,
    `subtotal` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `iva` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `ica` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `retencion_fuente` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `rete_iva` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `rete_ica` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `total_pagar` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `xml_original` LONGTEXT NULL,
    `qr_url` VARCHAR(500) NULL,
    `origen` ENUM('MANUAL', 'EXCEL_PORTAL') NOT NULL DEFAULT 'MANUAL',
    `estado_causacion` ENUM('PENDIENTE', 'CONCILIADO', 'CAUSADO', 'EXPORTADO', 'RECHAZADO', 'ERROR_XML') NOT NULL DEFAULT 'PENDIENTE',
    `puc_preliminar` VARCHAR(50) NULL,
    `requiere_revision_conciliacion` BOOLEAN NOT NULL DEFAULT false,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `uq_documentos_recibidos_cufe`(`cufe`),
    INDEX `idx_documentos_recibidos_razon_social`(`id_razon_social`),
    INDEX `idx_documentos_recibidos_casino`(`id_casino`),
    INDEX `idx_documentos_recibidos_estado_fecha`(`estado_causacion`, `fecha_creacion`),
    INDEX `idx_documentos_recibidos_reconciliacion`(`nit_emisor`, `numero_documento_completo`, `fecha_emision`),
    PRIMARY KEY (`id_documento_recibido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items_compra_recibidos` (
    `id_item_compra_recibido` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_documento_recibido` INTEGER UNSIGNED NOT NULL,
    `id_regla_aplicada` INTEGER UNSIGNED NULL,
    `descripcion` VARCHAR(255) NOT NULL,
    `cantidad` DECIMAL(15, 3) NOT NULL,
    `precio_unitario` DECIMAL(20, 2) NOT NULL,
    `subtotal` DECIMAL(20, 2) NOT NULL,
    `codigo_impuesto_1` VARCHAR(5) NOT NULL DEFAULT '01',
    `valor_impuesto_1` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `codigo_impuesto_2` VARCHAR(5) NULL,
    `valor_impuesto_2` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `codigo_impuesto_3` VARCHAR(5) NULL,
    `valor_impuesto_3` DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    `total` DECIMAL(20, 2) NOT NULL,
    `cuenta_puc` VARCHAR(50) NULL,
    `nombre_cuenta_puc` VARCHAR(150) NULL,
    `centro_costos` VARCHAR(50) NULL,
    `nombre_centro_costos` VARCHAR(150) NULL,
    `naturaleza` ENUM('D', 'C') NULL,
    `estado_mapeo` ENUM('SIN_MAPEAR', 'MAPEADO') NOT NULL DEFAULT 'SIN_MAPEAR',

    INDEX `idx_items_compra_recibidos_documento`(`id_documento_recibido`),
    INDEX `idx_items_compra_recibidos_regla`(`id_regla_aplicada`),
    PRIMARY KEY (`id_item_compra_recibido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reglas_mapeo_puc` (
    `id_regla_mapeo_puc` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_razon_social` INTEGER UNSIGNED NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `concepto` VARCHAR(150) NOT NULL,
    `nit_emisor` VARCHAR(30) NULL,
    `nombre_emisor` VARCHAR(180) NULL,
    `tipo_documento` ENUM('FACTURA', 'NOTA_CREDITO', 'NOTA_DEBITO') NULL,
    `cuenta_puc` VARCHAR(50) NOT NULL,
    `nombre_cuenta_puc` VARCHAR(150) NULL,
    `centro_costos` VARCHAR(50) NULL,
    `naturaleza` ENUM('D', 'C') NOT NULL,
    `prioridad` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `activa` BOOLEAN NOT NULL DEFAULT true,
    `fecha_creacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_actualizacion` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_reglas_mapeo_puc_razon_activa`(`id_razon_social`, `activa`),
    INDEX `idx_reglas_mapeo_puc_nit_emisor`(`nit_emisor`),
    PRIMARY KEY (`id_regla_mapeo_puc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `documentos_recibidos` ADD CONSTRAINT `fk_documentos_recibidos_razones_sociales` FOREIGN KEY (`id_razon_social`) REFERENCES `razones_sociales`(`id_razon_social`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos_recibidos` ADD CONSTRAINT `fk_documentos_recibidos_casinos` FOREIGN KEY (`id_casino`) REFERENCES `casinos`(`id_casino`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items_compra_recibidos` ADD CONSTRAINT `fk_items_compra_recibidos_documentos` FOREIGN KEY (`id_documento_recibido`) REFERENCES `documentos_recibidos`(`id_documento_recibido`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items_compra_recibidos` ADD CONSTRAINT `fk_items_compra_recibidos_reglas_puc` FOREIGN KEY (`id_regla_aplicada`) REFERENCES `reglas_mapeo_puc`(`id_regla_mapeo_puc`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reglas_mapeo_puc` ADD CONSTRAINT `fk_reglas_mapeo_puc_razones_sociales` FOREIGN KEY (`id_razon_social`) REFERENCES `razones_sociales`(`id_razon_social`) ON DELETE RESTRICT ON UPDATE CASCADE;
