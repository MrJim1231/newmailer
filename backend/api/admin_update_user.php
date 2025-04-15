<?php
// Заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Preflight-запрос
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Только POST-запрос
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Метод не поддерживается"]);
    exit;
}

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Получение данных
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$newRole = $data['role'] ?? null;
$newPassword = $data['password'] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "error" => "Не передан ID пользователя"]);
    exit;
}

// Проверка, есть ли пользователь
$checkStmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
$checkStmt->bind_param("i", $id);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "Пользователь не найден"]);
    $checkStmt->close();
    exit;
}
$checkStmt->close();

// Обновляем роль, если передана
if ($newRole) {
    $roleStmt = $conn->prepare("UPDATE users SET role = ? WHERE id = ?");
    $roleStmt->bind_param("si", $newRole, $id);
    $roleStmt->execute();
    $roleStmt->close();
}

// Обновляем пароль, если передан
if ($newPassword) {
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $passStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $passStmt->bind_param("si", $hashedPassword, $id);
    $passStmt->execute();
    $passStmt->close();
}

echo json_encode(["success" => true, "message" => "Данные пользователя обновлены"]);

$conn->close();
?>
