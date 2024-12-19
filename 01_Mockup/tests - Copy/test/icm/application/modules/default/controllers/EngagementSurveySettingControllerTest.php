<?php

declare(strict_types=1);

require_once APPLICATION_PATH . '/../../library/tests/test/ControllerTestCase.php';
require_once APPLICATION_PATH . '/../../core/application/modules/default/models/FuncLockModel.php';
require_once APPLICATION_PATH . '/../../icm/application/modules/default/controllers/EngagementCompareSettingController.php';

class EngagementCompareSettingControllerTest extends ControllerTestCase
{
    public $sessionCommon;
    public $session;
    private $hash = 'cef92980641f0684f352125860ec4fe60d948682604d398d1f85d960070df857';

    public function setUp(): void
    {
        include_once $_SERVER['DOCUMENT_ROOT'] . '/../../configs/define.php';
        include_once $_SERVER['DOCUMENT_ROOT'] . '/../../configs/_env/define.env.php';
        parent::setUp();

        // Login information
        $POST["headerAuth"] = "login";
        $POST["userId"] = "FLMsystem";
        $POST["userPass"] = "flm1234567";

        $this->dispatch('/FLM9T/login/login', 'POST', $POST);
        $sessionUserInfo = new Zend_Session_Namespace(SESSION_NAMESPACE_AUTH);
        if ($sessionUserInfo->isLocked()) {
            $sessionUserInfo->unlock();
        }
        $sessionUserInfo->sessionId    = session_id();
        $sessionUserInfo->companyCode  = "FLM9T";
        $sessionUserInfo->userCode     = "FLMsystem";
        $sessionUserInfo->userName     = "FLMsystem";
        $sessionUserInfo->jigyohombuCode = null;
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

    // ########## CONTROLLER TEST - EngagementCompareSettingController.php ##########
    // init()
    public function testInit()
    {
        $file = APPLICATION_PATH . '/../../configs/kc_config.ini';
        file_put_contents($file, "\n[systemMode]\nmode = 'KC'", FILE_APPEND);
        $this->_deleteFiles(APPLICATION_PATH . '/../../cache_file/');
        mkdir(APPLICATION_PATH . '/../../cache_file/');

        runkit7_method_copy('EngagementCompareSettingController', 'checkRole_bk', 'EngagementCompareSettingController', 'checkRole');
        runkit7_method_redefine('EngagementCompareSettingController', 'checkRole', '', '{
                $res = new stdClass();
                $res->hasRole = true;
                unset($this->sessionCommon);
                return $res;
            }', RUNKIT_ACC_PUBLIC);

        $this->mockDispatch('/FLM9T/engagement-compare-setting/init-update');
        $this->_controller->indexAction();
        $this->assertTrue(true);

        $file = APPLICATION_PATH . '/../../configs/kc_config.ini';
        file_put_contents($file, str_replace("\n[systemMode]\nmode = 'KC'", '', file_get_contents($file)));
        $this->_deleteFiles(APPLICATION_PATH . '/../../cache_file/');
        mkdir(APPLICATION_PATH . '/../../cache_file/');

        runkit7_method_remove('EngagementCompareSettingController', 'checkRole');
        runkit7_method_rename('EngagementCompareSettingController', 'checkRole_bk', 'checkRole');
    }
    //initAction
    public function testInitFail()
    {
        try {
            $this->mockDispatch('/FLM9T/engagement-compare-setting/fake-action');
            $this->_controller->indexAction();
        } catch (Exception_KC) {
            $this->assertTrue(true);
        }
    }

    public function testInit_HasRoleException()
    {
        try {
            runkit7_method_copy('EngagementCompareSettingController', 'checkRole_bk', 'EngagementCompareSettingController', 'checkRole');
            runkit7_method_redefine('EngagementCompareSettingController', 'checkRole', '', '{
                $res = new stdClass();
                $res->hasRole = false;
                return $res;
            }', RUNKIT_ACC_PUBLIC);
            $this->mockDispatch('/FLM9T/engagement-compare-setting/fake-action');
            $this->_controller->indexAction();
        } catch (Exception_KC) {
            $this->assertTrue(true);
        } finally {
            runkit7_method_remove('EngagementCompareSettingController', 'checkRole');
            runkit7_method_rename('EngagementCompareSettingController', 'checkRole_bk', 'checkRole');
        }
    }

    //initAction
    public function testIndexAction()
    {
        $this->mockDispatch('/FLM9T/engagement-compare-setting/init-update');
        $this->_controller->indexAction();
        $this->assertTrue(true);
    }

    // initUpdateAction
    public function testInitUpdateAction()
    {
        $this->session->engagementCompareSetting = array([1, 2, 3]);
        $this->mockDispatch('/FLM9T/engagement-compare-setting/init-update');
        $this->_controller->initUpdateAction();
        $this->assertTrue(true);
    }

    //returnUpdateAction
    public function testCheckedAction_HasFile()
    {

        $this->sessionCommon->submitHash = $this->hash;
        $formdata = $this->getFormData('bulk-update-true');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/checked', $formdata, 'POST');
        $this->_controller->checkedAction();
        unset($this->sessionCommon->submitHash);
        unset($_FILES);
        $this->assertTrue(true);
    }

    public function testCheckedAction_NotHasFile()
    {
        $this->sessionCommon->submitHash = $this->hash;
        $formdata = $this->getFormData('bulk-update-false');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/checked', $formdata, 'POST');
        $this->_controller->checkedAction();
        unset($this->sessionCommon->submitHash);
        $this->assertTrue(true);
    }

    public function testCheckedAction_NullFile()
    {
        $this->sessionCommon->submitHash = $this->hash;
        $formdata = $this->getFormData('bulk-update-null');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/checked', $formdata, 'POST');
        $this->_controller->checkedAction();
        unset($this->sessionCommon->submitHash);
        $this->assertTrue(true);
    }

    public function testCheckedAction_InvalidFile()
    {
        $testcases = array('invalid-filename', 'invalid-extension', 'invalid-0MB', 'invalid-35MB', 'invalid-2001-lines');
        $this->sessionCommon->submitHash = $this->hash;

        foreach ($testcases as $key => $val) {
            $formdata = $this->getFormData($val);
            $this->mockDispatch('/FLM9T/engagement-compare-setting/checked', $formdata, 'POST');
            $this->_controller->checkedAction();
        }
        unset($this->sessionCommon->submitHash);
        $this->assertTrue(true);
    }

    public function testReturnUpdateAction()
    {
        $this->sessionCommon->submitHash = $this->hash;
        $formdata = $this->getFormData('bulk-update-true');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/checked', $formdata, 'POST');
        $this->_controller->checkedAction();

        $this->mockDispatch('/FLM9T/engagement-compare-setting/return-update');
        $this->_controller->returnUpdateAction();
        $this->assertTrue(true);
    }

    public function testDownloadLogCheckAction()
    {
        $this->sessionCommon->submitHash = $this->hash;
        $formdata = $this->getFormData('bulk-update-true');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/checked', $formdata, 'POST');
        $this->_controller->checkedAction();

        $this->mockDispatch('/FLM9T/engagement-compare-setting/download-log-check');
        $this->_controller->downloadLogCheckAction();
        $this->assertTrue(true);
    }

    public function testUpdateAction_downloadAction()
    {
        $this->sessionCommon->submitHash = $this->hash;
        $formdata = $this->getFormData('bulk-update-true');
        $this->_dumpSQL();

        $this->mockDispatch('/FLM9T/engagement-compare-setting/checked', $formdata, 'POST');
        $this->_controller->checkedAction();

        $formdata = ['hash' => $this->sessionCommon->submitHash];
        $this->mockDispatch('/FLM9T/engagement-compare-setting/update', $formdata, 'POST');
        $this->_controller->updateAction();

        $this->_dumpSQL(false);

        $this->mockDispatch('/FLM9T/engagement-compare-setting/download-log-fail', $formdata, 'POST');
        $this->_controller->downloadLogFailAction();

        $this->mockDispatch('/FLM9T/engagement-compare-setting/download-log-all', $formdata, 'POST');
        $this->_controller->downloadLogAllAction();

        $this->mockDispatch('/FLM9T/engagement-compare-setting/return-checked', $formdata, 'POST');
        $this->_controller->returnCheckedAction();

        $this->assertTrue(true);
    }

    public function testUpdateAction_LockException()
    {
        $lockFunction = new FuncLockModel();
        $lockFunction->lock(FUNCTION_ID_EDIT_ENGAGEMENT_SURVEY_SETTING);

        $this->sessionCommon->submitHash = $this->hash;
        $formdata = $this->getFormData('bulk-update-true');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/checked', $formdata, 'POST');
        $this->_controller->checkedAction();

        $formdata = ['hash' => $this->sessionCommon->submitHash];
        $this->mockDispatch('/FLM9T/engagement-compare-setting/update', $formdata, 'POST');
        $this->_controller->updateAction();
        $this->assertTrue(true);

        $lockFunction->unlock(FUNCTION_ID_EDIT_ENGAGEMENT_SURVEY_SETTING);
    }

    public function testUpdateAction_InsertException()
    {
        try {
            $this->sessionCommon->submitHash = $this->hash;
            runkit7_method_copy('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate_bk', 'EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate');
            runkit7_method_redefine('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate', '$courseCodeFrom, $enqueteIdFrom, $itemIdFrom, $courseCodeTo, $enqueteIdTo', 'return array();', RUNKIT_ACC_PRIVATE);

            $this->_executeUpdateCSV('bulk-update-download');
        } catch (Exception $e) {
            $this->assertTrue(true);
        } finally {
            runkit7_method_remove('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate');
            runkit7_method_rename('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate_bk', '_selectEngagementSurveySettingForUpdate');
        }
    }

    public function testUpdateAction_UpdateDeleteCountLessThan1()
    {
        runkit7_method_copy('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate_bk', 'EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate');
        runkit7_method_redefine('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate', '$courseCodeFrom, $enqueteIdFrom, $itemIdFrom, $courseCodeTo, $enqueteIdTo', 'return array(1,2,3);', RUNKIT_ACC_PRIVATE);

        $this->_executeUpdateCSV('bulk-update-delete-download');
        $this->assertTrue(true);

        runkit7_method_remove('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate');
        runkit7_method_rename('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate_bk', '_selectEngagementSurveySettingForUpdate');
    }
    public function testUpdateAction_InsertCountLessThan1()
    {
        runkit7_method_copy('Zend_Db_Adapter_Abstract', 'insert_bk', 'Zend_Db_Adapter_Abstract', 'insert');
        runkit7_method_redefine('Zend_Db_Adapter_Abstract', 'insert', '$data', 'return 0;', RUNKIT_ACC_PUBLIC);
        runkit7_method_copy('FuncLockModel', 'lock_bk', 'FuncLockModel', 'lock');
        runkit7_method_redefine('FuncLockModel', 'lock', '$data', 'return true;', RUNKIT_ACC_PUBLIC);

        $this->_executeUpdateCSV('bulk-update-true');
        $this->assertTrue(true);

        runkit7_method_remove('Zend_Db_Adapter_Abstract', 'insert');
        runkit7_method_rename('Zend_Db_Adapter_Abstract', 'insert_bk', 'insert');
        runkit7_method_remove('FuncLockModel', 'lock');
        runkit7_method_rename('FuncLockModel', 'lock_bk', 'lock');
    }
    public function testUpdateAction_UpdateException()
    {
        runkit7_method_copy('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate_bk', 'EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate');
        runkit7_method_redefine('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate', '$courseCodeFrom, $enqueteIdFrom, $itemIdFrom, $courseCodeTo, $enqueteIdTo', 'return array(1,2,3);', RUNKIT_ACC_PRIVATE);
        runkit7_method_copy('Zend_Db_Adapter_Abstract', 'update_bk', 'Zend_Db_Adapter_Abstract', 'update');
        runkit7_method_redefine('Zend_Db_Adapter_Abstract', 'update', '$data', 'throw new Exception("update Exception");', RUNKIT_ACC_PUBLIC);
        try {
            $this->_executeUpdateCSV('bulk-update-delete-download');
        } catch (Exception $e) {
            $this->assertTrue(true);
        } finally {
            runkit7_method_remove('Zend_Db_Adapter_Abstract', 'update');
            runkit7_method_rename('Zend_Db_Adapter_Abstract', 'update_bk', 'update');
            runkit7_method_remove('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate');
            runkit7_method_rename('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate_bk', '_selectEngagementSurveySettingForUpdate');
        }
    }
    public function testUpdateAction_DeleteException()
    {
        runkit7_method_copy('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate_bk', 'EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate');
        runkit7_method_redefine('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate', '$courseCodeFrom, $enqueteIdFrom, $itemIdFrom, $courseCodeTo, $enqueteIdTo', 'return array(1,2,3);', RUNKIT_ACC_PRIVATE);
        runkit7_method_copy('Zend_Db_Adapter_Abstract', 'delete_bk', 'Zend_Db_Adapter_Abstract', 'delete');
        runkit7_method_redefine('Zend_Db_Adapter_Abstract', 'delete', '$data', 'throw new Exception("delete Exception");', RUNKIT_ACC_PUBLIC);
        try {
            $this->_executeUpdateCSV('bulk-update-delete-download');
        } catch (Exception $e) {
            $this->assertTrue(true);
        } finally {
            runkit7_method_remove('Zend_Db_Adapter_Abstract', 'delete');
            runkit7_method_rename('Zend_Db_Adapter_Abstract', 'delete_bk', 'delete');
            runkit7_method_remove('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate');
            runkit7_method_rename('EngagementCompareSettingModel', '_selectEngagementSurveySettingForUpdate_bk', '_selectEngagementSurveySettingForUpdate');
            $funcLockModel = new FuncLockModel();
            $funcLockModel->unlock(FUNCTION_ID_EDIT_ENGAGEMENT_SURVEY_SETTING);
        }
    }

    public function testInitSearchAction()
    {
        $this->sessionCommon->submitHash = $this->hash;
        $this->session->engagementCompareSetting = [1, 2, 3];
        $formdata = ['hash' => $this->sessionCommon->submitHash];

        $file = APPLICATION_PATH . '/../../configs/kc_config.ini';
        file_put_contents($file, str_replace('autoSearch          = "true"', 'autoSearch          = "false"', file_get_contents($file)));
        $this->_deleteFiles(APPLICATION_PATH . '/../../cache_file/');
        mkdir(APPLICATION_PATH . '/../../cache_file/');

        $this->mockDispatch('/FLM9T/engagement-compare-setting/init-search', $formdata, 'POST');
        $this->_controller->initSearchAction();
        $this->assertTrue(true);
    }

    public function testInitSearchAction_AutoSearch()
    {
        $this->sessionCommon->submitHash = $this->hash;
        $this->session->engagementCompareSetting = [1, 2, 3];
        $formdata = ['hash' => $this->sessionCommon->submitHash];

        $file = APPLICATION_PATH . '/../../configs/kc_config.ini';
        file_put_contents($file, str_replace('autoSearch          = "false"', 'autoSearch          = "true"', file_get_contents($file)));
        $this->_deleteFiles(APPLICATION_PATH . '/../../cache_file/');
        mkdir(APPLICATION_PATH . '/../../cache_file/');

        $this->mockDispatch('/FLM9T/engagement-compare-setting/init-search', $formdata, 'POST');
        $this->_controller->initSearchAction();
        $this->assertTrue(true);
        file_put_contents($file, str_replace('autoSearch          = "true"', 'autoSearch          = "false"', file_get_contents($file)));
        $this->_deleteFiles(APPLICATION_PATH . '/../../cache_file/');
        mkdir(APPLICATION_PATH . '/../../cache_file/');
    }

    public function testSearchAction()
    {
        $this->sessionCommon->submitHash = $this->hash;
        $this->sessionCommon->lastPortal = "ad";

        $this->session->engagementCompareSetting = [1, 2, 3];
        $formdata = ['hash' => $this->sessionCommon->submitHash];
        $this->mockDispatch('/FLM9T/engagement-compare-setting/init-search', $formdata, 'POST');
        $this->_controller->initSearchAction();

        $formdata = $this->getFormData('search');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/search', $formdata, 'POST');
        $this->_controller->searchAction();
        $this->assertTrue(true);
    }

    public function testSearchAction_invalid()
    {
        $this->sessionCommon->submitHash = $this->hash;
        $testcases = array('invalid-course-code', 'invalid-course-name');

        foreach ($testcases as $key => $val) {
            $formdata = $this->getFormData($val);
            $this->mockDispatch('/FLM9T/engagement-compare-setting/search', $formdata, 'POST');
            $this->_controller->searchAction();
        }
        $this->assertTrue(true);
    }

    public function testSearchAction_ResearchPerPage()
    {
        $this->sessionCommon->submitHash = $this->hash;

        $this->session->engagementCompareSetting = [1, 2, 3];
        $formdata = ['hash' => $this->sessionCommon->submitHash];
        $this->mockDispatch('/FLM9T/engagement-compare-setting/init-search', $formdata, 'POST');
        $this->_controller->initSearchAction();

        $formdata = $this->getFormData('search');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/search', $formdata, 'POST');
        $this->_controller->searchAction();

        $formdata = $this->getFormData('re-search');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/search', $formdata, 'POST');
        $this->_controller->searchAction();
        $this->assertTrue(true);
    }

    public function testDownloadAction()
    {
        $this->sessionCommon->submitHash = $this->hash;

        $this->_executeUpdateCSV('bulk-update-download');
        $formdata = $this->getFormData('search');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/search', $formdata, 'POST');
        $this->_controller->searchAction();

        $formdata = $this->getFormData('download');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/download', $formdata, 'POST');
        $this->_controller->downloadAction();

        $this->_executeUpdateCSV('bulk-update-delete-download');
        $formdata = $this->getFormData('search');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/search', $formdata, 'POST');
        $this->_controller->searchAction();

        $formdata = $this->getFormData('download');
        $this->mockDispatch('/FLM9T/engagement-compare-setting/download', $formdata, 'POST');
        $this->_controller->downloadAction();
        $this->assertTrue(true);
    }

    public function testDownloadAction_Exception()
    {
        try {
            runkit7_method_copy('Util_File', 'csvFileWriting_bk', 'Util_File', 'csvFileWriting');
            runkit7_method_redefine('Util_File', 'csvFileWriting', '$data, $stream, $csvcharset, $outputBreakLineCode', 'throw new Exception("CSV writing exception");', RUNKIT_ACC_STATIC);
            $this->sessionCommon->submitHash = $this->hash;
            $this->_executeUpdateCSV('bulk-update-download');
            $formdata = $this->getFormData('search');
            $this->mockDispatch('/FLM9T/engagement-compare-setting/search', $formdata, 'POST');
            $this->_controller->searchAction();

            $formdata = $this->getFormData('download');
            $this->mockDispatch('/FLM9T/engagement-compare-setting/download', $formdata, 'POST');
            $this->_controller->downloadAction();

            $this->_executeUpdateCSV('bulk-update-delete-download');
        } catch (Exception $e) {
            $this->assertTrue(true);
        } finally {
            runkit7_method_remove('Util_File', 'csvFileWriting');
            runkit7_method_rename('Util_File', 'csvFileWriting_bk', 'csvFileWriting');
        }
    }
    //get form-data
    private function getFormData($key)
    {
        if (Util_String::compare($key, 'bulk-update-true')) {
            $filepath = $_SERVER['DOCUMENT_ROOT'] . '/../../library/tests/test/csv/engagement_update_csv.csv';
            $_FILES = [
                'uploadFile' => [
                    'name' => 'engagement_update_csv.csv',
                    'type' => 'text/plain',
                    'tmp_name' => $filepath,  // Can be a temporary file created by PHP
                    'error' => 0,                    // 0 means no error
                    'size' => filesize($filepath)
                ]
            ];
            return [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'uploadFile' => $filepath,
                'fileCharacterCode' => [
                    'fileCharacterCode' => 'UTF-8'
                ]
            ];
        }

        if (Util_String::compare($key, 'bulk-update-null')) {
            $filepathnull = $_SERVER['DOCUMENT_ROOT'] . '\..\..\library\tests\test\csv\engagement_update_csv_null.csv';
            $_FILES = [
                'uploadFile' => [
                    'name' => 'engagement_update_csv_null.csv',
                    'type' => 'text/plain',
                    'tmp_name' => $filepathnull,
                    'error' => 0,
                    'size' => filesize($filepathnull)
                ]
            ];
            return [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'uploadFile' => $filepathnull,
                'fileCharacterCode' => [
                    'fileCharacterCode' => 'UTF-8'
                ]
            ];
        }

        if (Util_String::compare($key, 'bulk-update-false')) {
            $_FILES = [];
            return [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'fileCharacterCode' => [
                    'fileCharacterCode' => 'UTF-8'
                ]
            ];
        }

        if (Util_String::compare($key, 'search')) {
            return  [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'course_code' => 'ESCourse01',
                'course_name' => 'ES Course 01'
            ];
        }
        if (Util_String::compare($key, 'bulk-update-download')) {
            $filepath = $_SERVER['DOCUMENT_ROOT'] . '/../../library/tests/test/csv/engagement_update_download_csv.csv';
            $_FILES = [
                'uploadFile' => [
                    'name' => 'engagement_update_download_csv.csv',
                    'type' => 'text/plain',
                    'tmp_name' => $filepath,  // Can be a temporary file created by PHP
                    'error' => 0,                    // 0 means no error
                    'size' => filesize($filepath)
                ]
            ];
            return [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'uploadFile' => $filepath,
                'fileCharacterCode' => [
                    'fileCharacterCode' => 'UTF-8'
                ]
            ];
        }

        if (Util_String::compare($key, 'bulk-update-delete-download')) {
            $filepath = $_SERVER['DOCUMENT_ROOT'] . '/../../library/tests/test/csv/engagement_delete_download_csv.csv';
            $_FILES = [
                'uploadFile' => [
                    'name' => 'engagement_delete_download_csv.csv',
                    'type' => 'text/plain',
                    'tmp_name' => $filepath,  // Can be a temporary file created by PHP
                    'error' => 0,                    // 0 means no error
                    'size' => filesize($filepath)
                ]
            ];
            return [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'uploadFile' => $filepath,
                'fileCharacterCode' => [
                    'fileCharacterCode' => 'UTF-8'
                ]
            ];
        }
        if (Util_String::compare($key, 're-search')) {
            return  [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'course_code' => '',
                'course_name' => ''
            ];
        }

        if (Util_String::compare($key, 'download')) {
            return  [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'downloadCharset' => [
                    'downloadCharset' => 'UTF-8'
                ]
            ];
        }
        if (Util_String::compare($key, 'invalid-filename')) {
            $filepath = $_SERVER['DOCUMENT_ROOT'] . '/../../library/tests/test/csv/invalid.txt';
            $_FILES = [
                'uploadFile' => [
                    'name' => '',
                    'type' => 'text/plain',
                    'tmp_name' => $filepath,
                    'error' => 0,
                    'size' => 0
                ]
            ];
            return [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'uploadFile' => $filepath,
                'fileCharacterCode' => [
                    'fileCharacterCode' => 'UTF-8'
                ]
            ];
        }
        if (Util_String::compare($key, 'invalid-extension')) {
            $filepath = $_SERVER['DOCUMENT_ROOT'] . '/../../library/tests/test/csv/invalid.txt';
            $_FILES = [
                'uploadFile' => [
                    'name' => 'invalid.txt',
                    'type' => 'text/plain',
                    'tmp_name' => $filepath,
                    'error' => 0,
                ]
            ];
            return [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'uploadFile' => $filepath,
                'fileCharacterCode' => [
                    'fileCharacterCode' => 'UTF-8'
                ]
            ];
        }

        if (Util_String::compare($key, 'invalid-0MB')) {
            $filepath = $_SERVER['DOCUMENT_ROOT'] . '/../../library/tests/test/csv/invalid.txt';
            $_FILES = [
                'uploadFile' => [
                    'name' => 'engagement_update_csv.csv',
                    'type' => 'text/plain',
                    'tmp_name' => $filepath,
                    'error' => 0
                ]
            ];
            return [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'uploadFile' => $filepath,
                'fileCharacterCode' => [
                    'fileCharacterCode' => 'UTF-8'
                ]
            ];
        }
        if (Util_String::compare($key, 'invalid-35MB')) {
            $filepath = $_SERVER['DOCUMENT_ROOT'] . '/../../library/tests/test/csv/35mb.csv';
            $_FILES = [
                'uploadFile' => [
                    'name' => '35mb.csv',
                    'type' => 'text/plain',
                    'tmp_name' => $filepath,
                    'error' => 0,

                ]
            ];
            return [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'uploadFile' => $filepath,
                'fileCharacterCode' => [
                    'fileCharacterCode' => 'UTF-8'
                ]
            ];
        }

        if (Util_String::compare($key, 'invalid-2001-lines')) {
            $filepath = $_SERVER['DOCUMENT_ROOT'] . '/../../library/tests/test/csv/2001_lines.csv';
            $_FILES = [
                'uploadFile' => [
                    'name' => 'engagement_update_csv.csv',
                    'type' => 'text/plain',
                    'tmp_name' => $filepath,
                    'error' => 0,
                ]
            ];
            return [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'uploadFile' => $filepath,
                'fileCharacterCode' => [
                    'fileCharacterCode' => 'UTF-8'
                ]
            ];
        }
        if (Util_String::compare($key, 'invalid-course-code')) {
            return  [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'course_code' => 'ESCours"e01',
                'course_name' => 'ES Course 01'
            ];
        }

        if (Util_String::compare($key, 'invalid-course-name')) {
            return  [
                'hash' => $this->hash,
                'headerAuth' => 'le',
                'course_code' => 'ESCourse01',
                'course_name' => 'ES "Co"u"rse 01'
            ];
        }
    }

    private function _executeUpdateCSV($key)
    {
        $this->sessionCommon->submitHash = $this->hash;
        $formdata = $this->getFormData($key);
        $this->mockDispatch('/FLM9T/engagement-compare-setting/checked', $formdata, 'POST');
        $this->_controller->checkedAction();

        $formdata = ['hash' => $this->sessionCommon->submitHash];
        $this->mockDispatch('/FLM9T/engagement-compare-setting/update', $formdata, 'POST');
        $this->_controller->updateAction();
    }

    private function _dumpSQL($adding = true)
    {
        if ($adding)
            $sql = 'INSERT INTO `nextcafe`.`engagement_survey_compare_mapping` '
                . 'VALUES'
                . '("FLM9T", "ESCourse01", 72, 233, "coE01", 96, 281, 13, 1, 999, "Graph Title 999", 222, "Axis X", "FLM9T","system", now(), "FLM9T","system", now()),'
                . '("FLM9T", "ESCourse04", 72, 233, "ESCourse02", 71, 236, 13, 1, 602, "Graph Title 602", 101, "Axis X", "FLM9T","system", now(), "FLM9T","system", now()),'
                . '("FLM9T", "ESCourse01", 72, 233, "ESCourse04", 71, 236, 13, 1, 602, "Graph Title 602", 101, "Axis X", "FLM9T","system", now(), "FLM9T","system", now())';
        else
            $sql = 'DELETE FROM `nextcafe`.`engagement_survey_compare_mapping`'
                . 'WHERE (course_code_from = "ESCourse01" AND enquete_id_from = 72 AND item_id_from= 233 AND course_code_to = "coE01" AND enquete_id_to = 96)'
                . 'OR (course_code_from = "ESCourse04" AND enquete_id_from = 72 AND item_id_from= 233 AND course_code_to = "ESCourse02" AND enquete_id_to = 71)'
                . 'OR (course_code_from = "ESCourse01" AND enquete_id_from = 72 AND item_id_from= 233 AND course_code_to = "ESCourse04" AND enquete_id_to = 71)';
        $this->dumpSqlString($sql);
    }
}
