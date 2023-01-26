DROP DATABASE IF EXISTS hsy;
CREATE DATABASE hsy;
USE hsy;

 -- 用户
CREATE TABLE users(
    user_id INT PRIMARY KEY AUTO_INCREMENT, -- uid
    user_name VARCHAR(20) NOT NULL, -- 用户名
    user_image VARCHAR(40) NOT NULL, -- 用户头像
    user_point INT NOT NULL DEFAULT 0 -- 用户积分
);

 -- 建筑物信息
CREATE TABLE construction( --
    cons_id INT PRIMARY KEY AUTO_INCREMENT, -- 建筑物编号
    cons_name VARCHAR(20) NOT NULL, -- 建筑物名
    cons_history TEXT DEFAULT NULL, -- 建筑物历史
    cons_tale TEXT DEFAULT NULL, -- 校园故事
    cons_image VARCHAR(30) DEFAULT NULL, -- 建筑物图像
    cons_panorama VARCHAR(30) DEFAULT NULL, -- 全景图储存地址
    cons_coord DECIMAL(10,10) NOT NULL, -- 建筑物经纬度坐标
    cons_sound VARCHAR(30) DEFAULT NULL, -- 建筑物详情语音储存地址
    cons_video VARCHAR(30) DEFAULT NULL, -- 建筑物视频
    cons_ci_sum INT NOT NULL DEFAULT 0 -- 建筑物打卡总人数
);

 -- 评论
CREATE TABLE comment(
    com_num INT PRIMARY KEY AUTO_INCREMENT, -- 评论编号
    com_id INT, -- 外键 评论人
    constraint com_fk foreign key(com_id) references users(user_id),
    com_content TEXT NOT NULL, -- 评论内容
    com_time DATETIME NOT NULL, -- 评论时间
		com_construction INT NOT NULL, -- 评论的建筑物
    CONSTRAINT com_fk2 FOREIGN KEY(com_construction) REFERENCES construction(cons_id)
);

 -- 打卡
CREATE TABLE clock_in(
    ci_num INT PRIMARY KEY AUTO_INCREMENT, -- 打卡记录编号
    ci_id INT, -- 打卡人
    constraint ci_fk foreign key(ci_id) references users(user_id),
    ci_construct INT NOT NULL, -- 打卡建筑物
		CONSTRAINT ci_fk2 FOREIGN KEY(ci_construct) REFERENCES construction(cons_id),
    ci_time DATETIME NOT NULL -- 打卡时间
);

 -- 答题
CREATE TABLE q_and_a(
    qa_num INT PRIMARY KEY AUTO_INCREMENT, -- 题目编号
    qa_id INT, -- 题目对应的建筑物
    constraint qa_fk foreign key(qa_id) references construction(cons_id),
    qa_content TEXT NOT NULL -- 题目内容
);