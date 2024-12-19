DROP TABLE IF EXISTS `engagement_survey_compare_mapping`;
CREATE TABLE IF NOT EXISTS `engagement_survey_compare_mapping` (
  `company_code` varchar(10)  NOT NULL COMMENT '会社コード',
  `course_code_from` varchar(30)  NOT NULL COMMENT '今回コースコード',
  `enquete_id_from` int(10)  NOT NULL COMMENT '今回アンケートID',
  `item_id_from` int(10)  NOT NULL COMMENT '今回質問ID',
  `course_code_to` varchar(30)  NOT NULL COMMENT '前回コースコード',
  `enquete_id_to` int(10)  NOT NULL COMMENT '前回アンケートID',
  `item_id_to` int(10)   default null  COMMENT '前回質問ID',
  `show_order` numeric(4)  NOT NULL COMMENT '質問の表示順',
  `graph_mode` varchar(1)  NOT NULL COMMENT 'グラフモード',
  `graph_title_id` int(10)  NOT NULL  COMMENT 'グラフタイトルID',
  `graph_title_name` varchar(100)   default null  COMMENT 'グラフタイトル名',
  `axis_label_id` int(10)  NOT NULL  COMMENT '軸ラベルID',
  `axis_label_name` varchar(100)   default null  COMMENT '軸ラベル名',
  `regist_company_code` varchar(10)  NOT NULL COMMENT '登録者会社コード',
  `regist_user_code` varchar(254)  binary NOT NULL COMMENT '登録者コード',
  `regist_datetime` datetime  NOT NULL COMMENT '登録日時',
  `last_update_company_code` varchar(10)  NOT NULL COMMENT '最終更新者会社コード',
  `last_update_user_code` varchar(254)  binary NOT NULL COMMENT '最終更新者コード',
  `last_update_datetime` datetime  NOT NULL COMMENT '最終更新日時',
  PRIMARY KEY  (`company_code`,`course_code_from`,`enquete_id_from`,`item_id_from`,`course_code_to`,`enquete_id_to`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci  COMMENT='エンゲージメントサーベイ対象設定';
