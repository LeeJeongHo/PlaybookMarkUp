<?php
if ($_FILES['mpp-file']['error'] !== UPLOAD_ERR_OK) {
     die("Upload failed with error code " . $_FILES['mpp-file']['error']);
} else {
    $file_tmp  = $_FILES['mpp-file']['tmp_name'];
    $file_name = $_FILES['mpp-file']['name'];
    $move_path = dirname(__FILE__) . "/tmp/";

    if(is_uploaded_file($file_tmp)) {
        if(is_dir($move_path)){
            $move_path .= $file_name;

            if(move_uploaded_file($file_tmp, $move_path)){
                $json = shell_exec('java -jar '.escapeshellarg(dirname(__FILE__)."/msprojectreader/dist/msprojectreader.jar").' '.escapeshellarg($move_path).' 1');

                if ($json) {
                    echo '{"success": true, "data": '.$json.'}';
                } else {
                    echo '{"success": false, "msg": "Could not process uploaded file.", "data": null }';
                }

                unlink($move_path);
            } else {
                echo '{"success": false, "msg": "Cannot save file. Please verify, that web-server user account has write permission to ' . $move_path . '"}';
            }
        } else{
            echo '{"success": false, "msg": "No such directory exists."}';
        }
    }  else{
        echo '{"success": false, "msg": "Upload failed."}';
    }
}
?>