<?php

require __DIR__ . '/vendor/autoload.php';

include dirname(__FILE__) . "/constants.php";

function login()
{
    if (isset($_GET['userName']) && isset($_GET['userEmail']))
    {
        session_start();
        $_SESSION['userName'] = $_GET['userName'];
        $_SESSION['userEmail'] = $_GET['userEmail'];
        $_SESSION['contextIdentifier'] = contextIdentifier(18);
        session_write_close();

        $text = 'hola';
        $time = '1523925706028';
        $object = 'webnol';
        $context_identifier = $_SESSION['contextIdentifier'];
        $sender = $_SESSION['userName'];
        $responseData = post_curl($text, $time, $object, $context_identifier, $sender);
    }
    else
    {
        $responseData = json_encode([
            'id' => -1,
            'msg' => 'Por favor, debe ingresar su nombre y correo para iniciar.'
        ]);
    }

    return $responseData;
}

function contextIdentifier($length)
{
    $key = '';
    $array = array();
    for ($i = 0; $i < $length; $i++)
        $key .= rand(0, 9);

    return $key;
}

function logout()
{
    session_start();
    session_unset();
    session_destroy();
    session_write_close();
    setcookie(session_name(), '', 0, '/');
    session_regenerate_id(true);

    $responseData = json_encode([
        'id' => -1,
        'msg' => 'Gracias por comunicarse con nosotros.'
    ]);

    return $responseData;
}

function sendQuestion()
{
    if (isset($_GET['formMessage']) || !empty($_GET['formMessage']))
    {
        $formMessage = $_GET['formMessage'];

        session_start();
        $text = $formMessage;
        $time = '1523925706028';
        $object = 'webnol';
        $context_identifier = $_SESSION['contextIdentifier'];
        $sender = $_SESSION['userName'];
        $responseData = post_curl($text, $time, $object, $context_identifier, $sender);
    }
    else
    {
        $responseData = json_encode([
            'id' => -1,
            'msg' => 'Debes enviar una consulta.'
        ]);
    }

    return $responseData;
}

function error()
{
    $responseData = [
        'id' => -1,
        'msg' => 'error'
    ];

    return $responseData;
}

function post_curl($text, $time, $object, $context_identifier, $sender)
{
    $url = CLIENT_BASE_URL . CLIENT_PATH;
    $params = [
        "sender" => $sender,
        "context_identifier" => $context_identifier,
        "time" => $time,
        "text" => $text,
        "object" => $object
    ];
    $data_string = json_encode($params);

    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		//curl_setopt($ch, CURLOPT_ENCODING, "UTF-8" );
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
			//'Accept: application/json',
            'Content-Type: application/json;',
            'Content-Length: ' . strlen($data_string))
        );
        $result = curl_exec($ch);
		$result = mb_convert_encoding ($result, 'UTF-8','ISO-8859-1');
		$result = str_replace( '\r\n',  '<br />', $result );
        if ($result === false)
        {
            throw new Exception(curl_error($ch), curl_errno($ch));
        }
        curl_close($ch);
    } catch (Exception $e) {
        $result = json_encode([
            'id' => -1,
            'msg' => $e->getMessage()
        ]);
    }

    return $result;
}
