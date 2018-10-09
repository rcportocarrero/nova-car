<?php

include dirname(__FILE__) . "/constants.php";

$url = CLIENT_BASE_URL . CLIENT_PATH;
$params = [
    "sender" => "User Neptunia",
    "context_identifier" => "123456789123456789",
    "time" => "1523925706028",
    "text" => "hola",
    "object" => "webnol"
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
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        //'Accept: application/json',
        'Content-Type: application/json;',
        'Content-Length: ' . strlen($data_string))
    );
    $result = curl_exec($ch);
    $result = mb_convert_encoding($result, 'UTF-8', 'ISO-8859-1');
    $result = str_replace('\r\n', '<br />', $result);
    if ($result === false) {
        throw new Exception(curl_error($ch), curl_errno($ch));
    }
    curl_close($ch);
    
    
} catch (Exception $e) {
    $result = json_encode([
        'id' => -1,
        'msg' => $e->getMessage()
    ]);
}
header('Content-type:application/json;charset:utf-8');
echo $result;
die();