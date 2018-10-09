<?php

include dirname(__FILE__) . "/functions.php";

$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'GET')
{
    if (isset($_GET['action']))
    {
        $action = $_GET['action'];

        if ($action === 'question')
        {
            $responseData = sendQuestion();
        }else if($action === 'login'){
			$responseData = login();
		}else if($action === 'logout'){
			$responseData = logout();
		}else
        {
            $responseData = [
                'id' => -1,
                'msg' => 'Not action.'
            ];
        }
    }
    else
    {
        $responseData = [
            'id' => -1,
            'msg' => 'error'
        ];
    }
}
else
{
    $responseData = [
        'id' => -1,
        'msg' => 'Method ' . $method . ' is not supported.'
    ];
}

header('Content-type:application/json;');
echo $responseData;
die();
