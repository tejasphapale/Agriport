<?php
header("Content-Type: application/json");

$host = "localhost";
$port = "5432";
$dbname = "agriport";
$user = "postgres";
$password = "YOUR_ACTUAL_PASSWORD"; // 👈 Replace with real PostgreSQL password

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}
?>
