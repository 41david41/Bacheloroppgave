<?php
require_once("../db.php");

// Funksjoner
function validateInput($data, $pattern) {
    return preg_match($pattern, $data);
}
function sanitize($data) {
    return htmlspecialchars(trim($data));
}

// Validering
$patterns = [
    "orgnr" => "/^\d{9}$/",
    "bedriftsnavn" => "/^[\p{L}0-9\s\-\.]{2,}$/u",
    "adresse1" => "/^.{2,}$/",
    "adresse2" => "/^.{0,}$/",
    "postnr" => "/^\d{4}$/",
    "sted" => "/^[\p{L}\s\-]{2,}$/u",
    "epost" => "/^[^@\s]+@[^@\s]+\.[^@\s]+$/",
    "kontaktperson" => "/^[\p{L}\s\-]{2,}$/u",
    "kontaktpersonTlf" => "/^\d{8}$/",
    "kommentar" => "/.*/"
];

$errors = [];
$data = [];

foreach ($patterns as $key => $pattern) {
    if (!isset($_POST[$key]) || !validateInput($_POST[$key], $pattern)) {
        $errors[] = "$key har ugyldig eller manglende verdi.";
    } else {
        $data[$key] = sanitize($_POST[$key]);
    }
}

if (!empty($errors)) {
    echo "<script>alert('" . implode("\n", $errors) . "'); window.location.href='registrer_bedriftkundehtml.php';</script>";
    exit;
}

// Sjekk duplikater
$stmt = $pdo->prepare("SELECT COUNT(*) FROM bedriftskunde WHERE orgnr = :orgnr OR epost = :epost");
$stmt->execute([':orgnr' => $data['orgnr'], ':epost' => $data['epost']]);
if ($stmt->fetchColumn() > 0) {
    echo "<script>alert('Organisasjonsnummer eller e-post er allerede registrert.'); window.location.href='registrer_bedriftkundehtml.php';</script>";
    exit;
}

// === Bilde ===
$bildePath = "";
if (isset($_FILES['bilde']) && $_FILES['bilde']['error'] === UPLOAD_ERR_OK) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (in_array($_FILES['bilde']['type'], $allowedTypes)) {
        $ext = pathinfo($_FILES['bilde']['name'], PATHINFO_EXTENSION);
        $newName = uniqid("bilde_", true) . '.' . $ext;
        $uploadDir = realpath(__DIR__ . '/../BILDER/bedriftskundebilder');
        $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $newName;
        if (move_uploaded_file($_FILES['bilde']['tmp_name'], $uploadPath)) {
            $bildePath = "../BILDER/bedriftskundebilder/" . $newName;
        }
    }
}

// === PDF ===
$pdfPath = "";
if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] === UPLOAD_ERR_OK) {
    if ($_FILES['pdf']['type'] === 'application/pdf') {
        $ext = pathinfo($_FILES['pdf']['name'], PATHINFO_EXTENSION);
        $newName = uniqid("pdf_", true) . '.' . $ext;
        $uploadDir = realpath(__DIR__ . '/../PDF/bedriftskundepdf');
        $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $newName;
        if (move_uploaded_file($_FILES['pdf']['tmp_name'], $uploadPath)) {
            $pdfPath = "../PDF/bedriftskundepdf/" . $newName;
        }
    }
}

// === Sett inn i DB ===
$stmt = $pdo->prepare("INSERT INTO bedriftskunde (
    orgnr, bedriftsnavn, adresse1, adresse2, postnr, sted, epost, kontaktperson, kontaktpersonTlf, kommentar, bilde, pdf
) VALUES (
    :orgnr, :bedriftsnavn, :adresse1, :adresse2, :postnr, :sted, :epost, :kontaktperson, :kontaktpersonTlf, :kommentar, :bilde, :pdf
)");

$stmt->execute([
    ':orgnr' => $data['orgnr'],
    ':bedriftsnavn' => $data['bedriftsnavn'],
    ':adresse1' => $data['adresse1'],
    ':adresse2' => $data['adresse2'],
    ':postnr' => $data['postnr'],
    ':sted' => $data['sted'],
    ':epost' => $data['epost'],
    ':kontaktperson' => $data['kontaktperson'],
    ':kontaktpersonTlf' => $data['kontaktpersonTlf'],
    ':kommentar' => $data['kommentar'],
    ':bilde' => $bildePath,
    ':pdf' => $pdfPath
]);

header("Location: ../liste_bedriftkunde/bedriftkunde_liste.php");
?>
