<?php
$htmlfiles = glob("../../*.html");
$response = [];
foreach ($htmlfiles as $file) {
  array_push($response, basename($file));
  # code...
}

echo  json_encode($response);