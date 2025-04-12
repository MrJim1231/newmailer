<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Если это запрос OPTIONS (preflight request), сразу возвращаем ответ с кодом 200
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Получаем данные из запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверка, что все необходимые данные есть
if (!isset($data['MAIL_HOST'], $data['MAIL_USERNAME'], $data['MAIL_PASSWORD'], $data['MAIL_PORT'], $data['MAIL_ENCRYPTION'])) {
    echo json_encode(['message' => 'Все поля обязательны'], JSON_UNESCAPED_UNICODE);
    http_response_code(400);
    exit;
}

// Подготовка SQL-запроса для сохранения данных в таблицу email_config
$sql = "INSERT INTO email_config (MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD, MAIL_PORT, MAIL_ENCRYPTION) 
        VALUES (?, ?, ?, ?, ?)";

// Подготовка и выполнение запроса
$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Ошибка подготовки запроса: " . $conn->error);
    echo json_encode(['message' => 'Ошибка сервера, попробуйте позже'], JSON_UNESCAPED_UNICODE);
    http_response_code(500);
    exit;
}

// Привязываем параметры и выполняем запрос
$stmt->bind_param('sssis', $data['MAIL_HOST'], $data['MAIL_USERNAME'], $data['MAIL_PASSWORD'], $data['MAIL_PORT'], $data['MAIL_ENCRYPTION']);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Данные успешно сохранены'], JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode(['message' => 'Ошибка при сохранении данных'], JSON_UNESCAPED_UNICODE);
    http_response_code(500);
}

$stmt->close();
$conn->close();
?>
