<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Получаем входящие данные из JSON
$data = json_decode(file_get_contents("php://input"), true);

// Проверяем, что передан id
if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Не передан ID аккаунта']);
    exit;
}

$id = intval($data['id']);

// Подготавливаем SQL-запрос на удаление аккаунта
$sql = "DELETE FROM email_config WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Аккаунт успешно удалён']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при удалении аккаунта']);
}

$stmt->close();
$conn->close();
?>
