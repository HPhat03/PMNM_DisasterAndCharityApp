<?php

declare(strict_types=1);

class ControllerTestCase extends Zend_Test_PHPUnit_ControllerTestCase {
    public $tmp_name = APPLICATION_PATH . '/../../library/tests/test/UploadFile/';
    public $downloadFileDir = APPLICATION_PATH . '/../../library/tests/test/DownloadFile/';
    public $_controller;
    public $_dbName = '';
    private $_bootstrap = '';
    public function handler($errno, $errstr, $errfile, $errline) {
        $typestr = '';
        switch ($errno) {
    
            case E_ERROR: // 1 //
                $typestr = 'ERROR'; break;
            case E_WARNING: // 2 //
                $typestr = 'WARNING'; break;
            case E_PARSE: // 4 //
                $typestr = 'PARSE'; break;
            case E_NOTICE: // 8 //
                $typestr = 'NOTICE'; break;
            case E_CORE_ERROR: // 16 //
                $typestr = 'CORE_ERROR'; break;
            case E_CORE_WARNING: // 32 //
                $typestr = 'CORE_WARNING'; break;
            case E_COMPILE_ERROR: // 64 //
                $typestr = 'COMPILE_ERROR'; break;
            case E_CORE_WARNING: // 128 //
                $typestr = 'COMPILE_WARNING'; break;
            case E_USER_ERROR: // 256 //
                $typestr = 'USER_ERROR'; break;
            case E_USER_WARNING: // 512 //
                $typestr = 'USER_WARNING'; break;
            case E_USER_NOTICE: // 1024 //
                $typestr = 'USER_NOTICE'; break;
            case E_STRICT: // 2048 //
                $typestr = 'STRICT'; break;
            case E_RECOVERABLE_ERROR: // 4096 //
                $typestr = 'RECOVERABLE_ERROR'; break;
            case E_DEPRECATED: // 8192 //
                $typestr = 'DEPRECATED'; break;
            case E_USER_DEPRECATED: // 16384 //
                $typestr = 'USER_DEPRECATED'; break;
            default:
                $typestr = 'ERR'; break;
        }
    
        $dateYMD = date('Ymd');
        $dateYMDHIS = date('Y-m-d H:i:s');
        $errTxt = "$dateYMDHIS [$typestr] $errstr in file $errfile($errline)";
    
        $log = $this->debug_string_backtrace($errTxt);
    
        file_put_contents(APPLICATION_PATH . '/../../library/tests/test/log/' . "err_$dateYMD.log", $log, FILE_APPEND | LOCK_EX);
    
    
        $exception = 'Error_Error';
        throw new $exception("$errstr in file $errfile($errline)", $errno, $errfile, $errline);
        
    }
    public function debug_string_backtrace($errTxt) {
    
        ob_start();
    
        debug_print_backtrace(10,10);
    
        $trace = ob_get_contents();
    
        ob_end_clean();
    
        $trace = preg_replace ('/^#0\s+.*/', $errTxt, $trace, 1);
    
        return $trace;
    
    }

    public function setUp(): void
    {
        set_error_handler(array(&$this,'handler'));
        if ($this->_dbName == '') {
            $this->_dbName = 'nextcafe';
        }
        $this->bootstrap = array($this, 'appBootstrap');
        parent::setUp();
    }

    public function appBootstrap()
    {
        require_once APPLICATION_PATH . '/Bootstrap.php';

        try {
            $bootstrap = new Bootstrap(APPLICATION_PATH);
            $bootstrap->initBootstrap();
            
        } catch (Exception $exception) {
            if (!Zend_Registry::isRegistered(REGISTRY_KEY_LOGGER)) {
                Base_Bootstrap::registZendRegistryWhenErrorOccurred();
            }
            $logger = Zend_Registry::get(REGISTRY_KEY_LOGGER);
            $logger->error($exception->getMessage(), $exception);
            
            $body = '<html><head>';
            $body .= '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';
            $body .= '<title>Error</title>';
            $body .= '</head><body>';
            // ajaxアクセス対応
            $body .= '<div id="KC00E000"></div>';
            $body .= 'Error occurred.';
            $body .= '</body></html>';
            echo $body;
            exit;
        }
    }

    public function mockDispatch($url, $params=[], $method = 'GET') {
        $request = $this->getRequest();
        if (!empty($params)) {
            $request->setPost($params);
        }        

        $uri = [];
        foreach (explode('/',$url) as $val) {
            if ($val == "") {
                continue;
            }
            $uri[] = $val;
        }

        $companyCode = $uri[0];
        $controller = $uri[1];
        $action = $uri[2] ?? 'index';

        $request->setParams(['action' => $action]);

        $request->setControllerName($controller)
                ->setActionName($action);

        $request->setMethod($method);
        $response = $this->getResponse();
        $controller = $this->_convertToCamelCasing($uri[1]) . 'Controller';
        $this->_controller = new $controller($request,$response);
    }

    public function mockDispatchCommonController($url, $params=[], $method = 'GET') {
        $request = $this->getRequest();
        if (!empty($params)) {
            $request->setPost($params);
        }        

        $uri = [];
        foreach (explode('/',$url) as $val) {
            if ($val == "") {
                continue;
            }
            $uri[] = $val;
        }

        $companyCode = $uri[0];
        $controller = $uri[1];
        
        $request->setParams($_FILES);

        $request->setControllerName($controller);

        $request->setMethod($method);
        $response = $this->getResponse();
        $controller = $this->_toSnakeString($uri[1]) . 'Controller';
        $this->_controller = new $controller($request,$response);
    }

    private function _toSnakeString($inputString, $delimiter = '-') {
        $result = str_replace(
            $delimiter,
            '_',
            $inputString,
        );
        return $result;
    }
    
    private function _convertToCamelCasing($str, $delimiter = '-')
    {
        $result = '';
        $segments = explode($delimiter, $str);
        foreach ($segments as $idx => $segment) {
            $segment = strtolower($segment);
            $upper = strtoupper(substr($segment, 0, 1));
            $pattern = '/^./';
            $segment = preg_replace($pattern, $upper, $segment);
            $result .= $segment; 
        }
        return $result;
    }

    public function dumpSqlFile($file) {
        $sql = file_get_contents(APPLICATION_PATH . '/../../library/tests/test/SQLDump/'. $file);
        return $this->_dump($sql);

    }

    public function dumpSqlString($sql) {
        return $this->_dump($sql);
    }

    private function _dump($sql)
    {
        $mysqli = new mysqli("172.16.0.103","cafeadmin","nextC@fe2020",$this->_dbName);

        // Check connection
        if ($mysqli -> connect_errno) {
            echo "Failed to connect to MySQL: " . $mysqli->connect_error;
            exit();
        }
        $result = null;
        // Perform query
        try {
            $mysqli->autocommit(FALSE);
            $result = $mysqli->query($sql);
            $mysqli->commit();
        } catch (\Throwable $th) {
            $mysqli -> rollback();
        }

        $mysqli->close();
        return $result;
    }
    public function _deleteFiles($target) {
        if(is_dir($target)){
            $files = glob( $target . '{,.}[!.,!..]**', GLOB_MARK|GLOB_BRACE );
            foreach( $files as $file ){
                $this->_deleteFiles( $file );
            }

            rmdir( $target );
        } elseif(is_file($target)) {
            unlink( $target );
        }
    }
}