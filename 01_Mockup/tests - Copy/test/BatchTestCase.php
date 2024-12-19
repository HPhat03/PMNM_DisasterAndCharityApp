<?php

declare(strict_types=1);
use PHPUnit\Framework\TestCase;
class BatchTestCase extends TestCase {
    
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
    
        file_put_contents(APPLICATION_PATH . '/../../library/tests/test/log-batch/' . "err_$dateYMD.log", $log, FILE_APPEND | LOCK_EX);
    
    

        $exception = 'Error_Error';
        throw new $exception("$errstr in file $errfile($errline)", $errno, $errfile, $errline);
        
    }
    public function debug_string_backtrace($errTxt) {
    
        ob_start();
    
        debug_print_backtrace();
    
        $trace = ob_get_contents();
    
        ob_end_clean();
    
        $trace = preg_replace ('/^#0\s+.*/', $errTxt, $trace, 1);
    
        return $trace;
    
    }
    public function setUp() : void {
        set_error_handler(array(&$this,'handler'));
        parent::setUp();
    }
}