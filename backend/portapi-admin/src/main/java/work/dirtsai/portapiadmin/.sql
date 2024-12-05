use portapi_db;
create table api_info (
                          id int primary key auto_increment,
                          name varchar(255),
                          url varchar(255),
                          method varchar(255),
                          description varchar(255),
                          status int,
                          headers varchar(255),
                          params varchar(255),
                          response varchar(255),
                          create_time datetime,
                          update_time datetime
);

use portapi_db;
-- 创建token_groups表
CREATE TABLE `token_groups` (
                                `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                                `name` VARCHAR(255) NOT NULL,
                                `is_deleted` TINYINT,
                                `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                PRIMARY KEY (`id`),
                                UNIQUE KEY `name` (`name`)
);

-- 创建tokens表
CREATE TABLE `tokens` (
                          `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
                          `token_number` VARCHAR(255) NOT NULL,
                          `name` VARCHAR(255) NOT NULL,
                          `expires_at` DATETIME NOT NULL,
                          `max_quota` INT UNSIGNED NOT NULL,
                          `remaining_quota` INT UNSIGNED NOT NULL,
                          `total_quota` INT UNSIGNED NOT NULL,
                          `used_quota` INT UNSIGNED NOT NULL DEFAULT 0,
                          `model_restriction` VARCHAR(255),
                          `status` TINYINT NOT NULL,
                          `group_id` INT UNSIGNED,
                          `created_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          `updated_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          `is_deleted` DATETIME,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `token` (`token`),
                          KEY `group_id` (`group_id`),
                          CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `token_groups` (`id`) ON DELETE SET NULL
);

-- 创建models表
use portapi_db;
create table models (
                        id int primary key auto_increment,
                        model_id int not null,
                        model_name varchar(255) not null,
                        model_company varchar(255) not null,
                        model_version varchar(255) not null,
                        real_api_key varchar(255) not null,
                        remain_quote decimal not null,
                        is_deleted tinyint not null default 0,
                        created_time timestamp not null default current_timestamp,
                        updated_time timestamp not null default current_timestamp

);


use portapi_db;
CREATE TABLE `api_calls` (
                             `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                             `token_number` VARCHAR(64) NOT NULL COMMENT '用户ID',
                             `call_model` VARCHAR(50) NOT NULL COMMENT '调用的模型名称',
                             `used_token` INT UNSIGNED NOT NULL COMMENT '使用的token数量',
                             `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '调用时间',
                             `status` TINYINT NOT NULL COMMENT '请求状态：1成功，0失败',
                             `response_time` INT UNSIGNED COMMENT '响应时间(ms)',
                             PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='API调用记录表';
