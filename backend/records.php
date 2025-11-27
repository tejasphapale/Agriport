<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM transport_records ORDER BY id DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['customer'], $data['crop'], $data['crates'], $data['date'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing fields"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO transport_records (customer, crop, crates, date) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['customer'], $data['crop'], $data['crates'], $data['date']]);

    $id = $pdo->lastInsertId("transport_records_id_seq");
    $data['id'] = $id;

    echo json_encode($data);
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
