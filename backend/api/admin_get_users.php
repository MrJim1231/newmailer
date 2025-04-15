<?php
// Заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Preflight-запрос
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Только GET-запрос
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(["success" => false, "error" => "Метод не поддерживается"]);
    exit;
}

// Подключение к БД
require_once __DIR__ . '/../includes/db.php';

// Получение всех пользователей
$sql = "SELECT id, email, role, created_at FROM users ORDER BY created_at DESC";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $users = [];

    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    echo json_encode(["success" => true, "users" => $users]);
} else {
    echo json_encode(["success" => false, "error" => "Пользователи не найдены"]);
}

$conn->close();
?>
