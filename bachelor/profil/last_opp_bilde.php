<?php
session_start();
$username = $_SESSION["brukernavn"] ?? null;

if (!$username) {
    die("❌ Ikke logget inn.");
}

$safeName = preg_replace('/[^a-zA-Z0-9]/', '', $username); // f.eks. sasha3no
$uploadDir = "C:/xampp/htdocs/Bacheloroppgave/bachelor/BILDER/profilbilder/";
$allowedTypes = ['image/png' => 'png', 'image/jpeg' => 'jpg', 'image/webp' => 'webp'];

if (isset($_FILES["profilbilde"]) && $_FILES["profilbilde"]["error"] === UPLOAD_ERR_OK) {
    $fileTmp = $_FILES["profilbilde"]["tmp_name"];
    $fileType = mime_content_type($fileTmp);

    if (!array_key_exists($fileType, $allowedTypes)) {
        die("❌ Ugyldig filtype.");
    }

    $ext = $allowedTypes[$fileType];
    $destPath = $uploadDir . $safeName . "." . $ext;

    // Fjern gamle filer
    foreach ($allowedTypes as $oldExt) {
        $old = $uploadDir . $safeName . "." . $oldExt;
        if (file_exists($old)) unlink($old);
    }

    if (move_uploaded_file($fileTmp, $destPath)) {
        header("Location: profile.php");
        exit;
    } else {
        echo "❌ Kunne ikke lagre filen.";
    }
} else {
    echo "❌ Ingen fil valgt eller feil oppstod.";
}
?>
