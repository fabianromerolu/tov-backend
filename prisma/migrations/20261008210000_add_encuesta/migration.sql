CREATE TABLE `Encuesta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `emociones` JSON NOT NULL,
    `otraEmocion` VARCHAR(80) NULL,
    `nivelIdentificacion` INTEGER NOT NULL,
    `impactoAutopercepcion` VARCHAR(32) NOT NULL,
    `deseaMasIniciativas` VARCHAR(16) NOT NULL,
    `comentario` VARCHAR(500) NULL,
    `consentimiento` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
