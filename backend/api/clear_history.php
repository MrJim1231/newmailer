<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Проверка что запрос — POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit();
}

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Выполняем очистку таблицы email_history
$sql = "DELETE FROM email_history";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['message' => 'Email history cleared successfully']);
} else {
    echo json_encode(['message' => 'Error clearing email history: ' . $conn->error]);
}

$conn->close();
?>
