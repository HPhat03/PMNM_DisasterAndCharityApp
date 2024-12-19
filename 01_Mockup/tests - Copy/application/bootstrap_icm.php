<?php
defined('APPLICATION_PATH')
|| define('APPLICATION_PATH', 'D:\PhatMai\PHP\KC_FROM_CUSTOMER\kc_php_unit\cafe-engagement-survey\icm\application');

set_include_path(
    implode(
        PATH_SEPARATOR,
        array(
            APPLICATION_PATH . '/../../library',
            APPLICATION_PATH . '/../../library/Pear',
            APPLICATION_PATH . '/../../common',
            get_include_path(),
        )
    )
);

// Autoloader設定
require_once 'Zend/Loader/Autoloader.php';
$autoloader = Zend_Loader_Autoloader::getInstance();
$autoloader->setFallbackAutoloader(true);

// require_once 'Zend/Application.php';
// require_once 'ControllerTestCase.php';