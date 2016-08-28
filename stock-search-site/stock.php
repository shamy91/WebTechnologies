<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
if(isset($_GET['symb'])){
    
    $text1 = $_GET['symb'];
    $url="http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=";
    $url.=$text1;
    function file_cont($path) {
        $str = @file_get_contents($path);
            if ($str === FALSE) {
                throw new Exception("Cannot access '$path' to read contents.");
            } else {
                return $str;
            }
        }
    //echo json_encode(array('return' => 1, 'msg1' => 'Message sent OK, we will be in touch ASAP'));
    $jsn = file_cont($url);
    echo $jsn;
}
if(isset($_GET['input'])){
    
    $text2 = $_GET['input'];
    $lurl="http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=";
    $lurl.=$text2;
    function file_cont($path) {
        $str = @file_get_contents($path);
            if ($str === FALSE) {
                throw new Exception("Cannot access '$path' to read contents.");
            } else {
                return $str;
            }
        }
    $j = file_cont($lurl);
    echo $j;
}
   
if(isset($_GET['parameters'])){
    $pars = $_GET['parameters'];
    $churl = 'http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A365%2C%22DataPeriod%22%3A%22Day%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22'.$pars.'%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22ohlc%22%5D%7D%5D%7D';
    function file_cont($path) {
        $str = @file_get_contents($path);
            if ($str === FALSE) {
                throw new Exception("Cannot access '$path' to read contents.");
            } else {
                return $str;
            }
        }
    $jchart = file_cont($churl);
	echo $jchart;
}

?>
