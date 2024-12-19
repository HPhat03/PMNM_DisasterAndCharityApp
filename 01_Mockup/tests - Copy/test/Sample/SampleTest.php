<?php

declare(strict_types=1);

require_once APPLICATION_PATH . '/../../library/tests/test/ControllerTestCase.php';

require_once APPLICATION_PATH . '/../../icm/application/modules/default/controllers/IndexController.php';

class SampleTest extends ControllerTestCase
{

    public function setUp(): void {
        include_once $_SERVER['DOCUMENT_ROOT'] . '/../../configs/define.php';
        include_once $_SERVER['DOCUMENT_ROOT'] . '/../../configs/_env/define.env.php';
        parent::setUp();

        // Login information
        $POST["headerAuth"] = "login";
        $POST["userId"] = "FLMsystem";
        $POST["userPass"] = "flm1234567";
        
        $this->dispatch('/FLM9T/login/login','POST',$POST);
        $sessionUserInfo = new Zend_Session_Namespace(SESSION_NAMESPACE_AUTH);
        if ($sessionUserInfo->isLocked()) {
            $sessionUserInfo->unlock();
        }
        $sessionUserInfo->sessionId    = session_id();
        $sessionUserInfo->companyCode  = "FLM9T";
        $sessionUserInfo->userCode     = "FLMsystem";
        $sessionUserInfo->userName     = "FLMsystem";
        $sessionUserInfo->role         = [
            [
                "company_code" => "FLM9T",
                "user_code" => "FLMsystem",
                "role_div" => "50",
                "role_group_div" => "5"
            ],
            [
                "company_code" => "FLM9T",
                "user_code" => "FLMsystem",
                "role_div" => "30",
                "role_group_div" => "3"
            ],
            [
                "company_code" => "FLM9T",
                "user_code" => "FLMsystem",
                "role_div" => "20",
                "role_group_div" => "2"
            ],
            [
                "company_code" => "FLM9T",
                "user_code" => "FLMsystem",
                "role_div" => "00",
                "role_group_div" => "0"
            ],
            [
                "company_code" => "FLM9T",
                "user_code" => "FLMsystem",
                "role_div" => "10",
                "role_group_div" => "1"
            ],
            [
                "company_code" => "FLM9T",
                "user_code" => "FLMsystem",
                "role_div" => "99",
                "role_group_div" => "9"
            ],          
        ];
        $sessionUserInfo->timezone     = "Asia/Tokyo";
        $sessionUserInfo->lang         = "jp";
        $sessionUserInfo->showCartButton = false;
        $sessionUserInfo->lastLoginDatetime = "2024-11-05 16:54:32";

        // Logged-in user common model class
        $sessionCommonLoginModel = new Zend_Session_Namespace(SESSION_NAMESPACE_LOGIN_MODEL);
        $sessionCommonLoginModel->instance = new Model_Login_User('FLM9T', 'FLMsystem');
        // Session common
        $this->sessionCommon    = new Zend_Session_Namespace(SESSION_NAMESPACE_COMMON);
        $this->sessionCommon->lastPortal = "le";
        // Session
        $appPaths      = explode(DIRECTORY_SEPARATOR, APPLICATION_PATH);
        $subSystemName = $appPaths[count($appPaths) - 2];
        $this->session          = new Zend_Session_Namespace($subSystemName);
    }
    
    public function testInit() {
        try{
            $this->mockDispatch('/FLM9T/index/index');
        $this->_controller->indexAction();
        } catch (Exception_KC){
            $this->assertTrue(true);
        }
    }
}