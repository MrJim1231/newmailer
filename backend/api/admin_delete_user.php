<?php
// Заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Preflight-запрос
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Только DELETE-запрос
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode(["success" => false, "error" => "Метод не поддерживается"]);
    exit;
}

// Подключение к БД
require_once __DIR__ . '/../includes/db.php';

// Получаем данные из тела запроса
$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['id'] ?? null;

// Проверка ID
if (!$userId || !is_numeric($userId)) {
    echo json_encode(["success" => false, "error" => "Неверный ID пользователя"]);
    exit;
}

// Проверка, существует ли пользователь
$checkStmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
$checkStmt->bind_param("i", $userId);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "Пользователь не найден"]);
    $checkStmt->close();
    $conn->close();
    exit;
}
$checkStmt->close();

// Удаление пользователя
$deleteStmt = $conn->prepare("DELETE FROM users WHERE id = ?");
$deleteStmt->bind_param("i", $userId);

if ($deleteStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Пользователь успешно удалён"]);
} else {
    echo json_encode(["success" => false, "error" => "Ошибка при удалении: " . $conn->error]);
}

$deleteStmt->close();
$conn->close();
