-- สร้างตาราง User
CREATE TABLE User (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    citizenId  VARCHAR(191) NOT NULL UNIQUE,
    phone      VARCHAR(191) NOT NULL,
    password   VARCHAR(191) NOT NULL,
    createdAt  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- สร้างตาราง Appointment (ใบนัดหมาย)
CREATE TABLE Appointment (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    userId     INT NOT NULL,
    date       DATETIME NOT NULL,
    time       VARCHAR(10) NOT NULL,
    department VARCHAR(100) NOT NULL,
    createdAt  DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    -- สร้าง Foreign Key เชื่อมกับ User
    CONSTRAINT appointment_userId_fkey FOREIGN KEY (userId) REFERENCES User(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
