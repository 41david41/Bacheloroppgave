<?php
include("profile_backend.php");
?>

<!DOCTYPE html>
<html lang="no">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brukerprofil</title>

    <!-- Stilark og fonter -->
    <link rel="stylesheet" href="../css/profil.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined">

    <!-- Tailwind og JS -->
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <script src="../redirectToPage.js"></script>
</head>
<body>

<!-- Header -->
<div id="header">
    <?php include("../header/header.php"); ?>
</div>

<!-- Profilkort -->
<div class="profil-container">
    <div class="profil-card">
        <div class="profil-info">
            <p>Brukernavn: <?php echo htmlspecialchars($username); ?></p>
            <br>
            <p>E-post: <?php echo htmlspecialchars($epost); ?></p>
            <br>
            <p>Rolle: <?php echo htmlspecialchars($rolle); ?></p>
            <br>
            <div class="profil-button"><a href="change_password.php"><button class="secondaryBTN">Endre passord</button></a></div>
        </div>
    </div>
</div>

</body>
</html>
