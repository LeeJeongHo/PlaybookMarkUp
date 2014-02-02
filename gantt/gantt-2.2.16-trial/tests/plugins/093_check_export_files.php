<?php
    if(isset($_POST['filename'])){
        $file = stripslashes($_POST['filename']);

        if (file_exists($file)){
            if (filesize($file) > 0){
                echo '{"success": true, "exists": true, "size": '.filesize($file).'}';
            } else {
                echo '{"success": false, "exists": true, "size": null}';
            }

            unlink($file);
        } else {
            echo '{"success": false, "exists": false, "size": null}';
        }
    }
?>