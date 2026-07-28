/*
  Warnings:

  - You are about to drop the column `casino` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `ciudad` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `contrasena` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cedula]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fecha_actualizacion` to the `generos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_actualizacion` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_actualizacion` to the `tipos_documento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_casino` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_ciudad` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Made the column `cargo` on table `usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha_nacimiento` on table `usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefono` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `fk_usuarios_genero`;

-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `fk_usuarios_roles`;

-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `fk_usuarios_tipo_documento`;

-- DropForeignKey
ALTER TABLE `usuarios` DROP FOREIGN KEY `fk_usuarios_tipo_documento`;

-- DropIndex
DROP INDEX `idx_usuarios_codigo_helisa` ON `usuarios`;

-- DropIndex
DROP INDEX `uq_usuarios_tipo_documento_cedula` ON `usuarios`;

-- AlterTable
ALTER TABLE `generos` ADD COLUMN `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    ADD COLUMN `fecha_actualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `roles` ADD COLUMN `fecha_actualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `tipos_documento` ADD COLUMN `estado` ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    ADD COLUMN `fecha_actualizacion` DATETIME(3) NOT NULL,
    ADD COLUMN `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `casino`,
    DROP COLUMN `ciudad`,
    DROP COLUMN `contrasena`,
    ADD COLUMN `id_casino` INTEGER NOT NULL,
    ADD COLUMN `id_ciudad` INTEGER NOT NULL,
    ADD COLUMN `password_hash` VARCHAR(255) NOT NULL,
    MODIFY `cargo` VARCHAR(120) NOT NULL,
    MODIFY `fecha_nacimiento` DATE NOT NULL,
    MODIFY `telefono` VARCHAR(30) NOT NULL;

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

-- CreateIndex
CREATE INDEX `generos_estado_idx` ON `generos`(`estado`);

-- CreateIndex
CREATE INDEX `tipos_documento_estado_idx` ON `tipos_documento`(`estado`);

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_cedula_key` ON `usuarios`(`cedula`);

-- CreateIndex
CREATE INDEX `usuarios_id_ciudad_idx` ON `usuarios`(`id_ciudad`);

-- CreateIndex
CREATE INDEX `usuarios_id_casino_idx` ON `usuarios`(`id_casino`);

-- CreateIndex
CREATE INDEX `usuarios_apellido_nombre_idx` ON `usuarios`(`apellido`, `nombre`);

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_tipo_doc_fkey` FOREIGN KEY (`id_tipo_doc`) REFERENCES `tipos_documento`(`id_tipo_doc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_genero_fkey` FOREIGN KEY (`id_genero`) REFERENCES `generos`(`id_genero`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_rol_fkey` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_ciudad_fkey` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades`(`id_ciudad`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_casino_fkey` FOREIGN KEY (`id_casino`) REFERENCES `casinos`(`id_casino`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `generos` RENAME INDEX `uq_generos_nombre` TO `generos_nombre_genero_key`;

-- RenameIndex
ALTER TABLE `roles` RENAME INDEX `idx_roles_estado` TO `roles_estado_idx`;

-- RenameIndex
ALTER TABLE `roles` RENAME INDEX `uq_roles_nombre` TO `roles_nombre_rol_key`;

-- RenameIndex
ALTER TABLE `tipos_documento` RENAME INDEX `uq_tipo_documento_nombre` TO `tipos_documento_nombre_doc_key`;

-- RenameIndex
ALTER TABLE `usuarios` RENAME INDEX `idx_usuarios_estado` TO `usuarios_estado_idx`;

-- RenameIndex
ALTER TABLE `usuarios` RENAME INDEX `idx_usuarios_genero` TO `usuarios_id_genero_idx`;

-- RenameIndex
ALTER TABLE `usuarios` RENAME INDEX `idx_usuarios_rol` TO `usuarios_id_rol_idx`;

-- RenameIndex
ALTER TABLE `usuarios` RENAME INDEX `idx_usuarios_tipo_documento` TO `usuarios_id_tipo_doc_idx`;

-- RenameIndex
ALTER TABLE `usuarios` RENAME INDEX `uq_usuarios_correo` TO `usuarios_correo_key`;
