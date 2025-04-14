<?php
// Заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Preflight-запрос (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Подключение к БД и автозагрузчик
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// JWT настройки
$jwt_secret = "MY_SECRET_KEY"; // Используй надежный секрет в продакшн
$jwt_issuer = "http://localhost:5173";

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Метод не поддерживается"]);
    exit();
}

// Проверка авторизации через токен
$headers = apache_request_headers();
if (isset($headers['Authorization'])) {
    $authHeader = $headers['Authorization'];
    list($type, $token) = explode(" ", $authHeader);

    if ($type == "Bearer" && $token) {
        try {
            // Декодируем токен
            $decoded = JWT::decode($token, new Key($jwt_secret, 'HS256'));
            $user_id = $decoded->sub;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Токен не предоставлен или неверный']);
            exit();
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Токен не предоставлен']);
        exit();
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Токен не предоставлен']);
    exit();
}

// Получаем данные из запроса
$data = json_decode(file_get_contents("php://input"), true);

// Проверка данных
if (!isset($data['account_name'], $data['MAIL_USERNAME'], $data['MAIL_PASSWORD'], $data['MAIL_HOST'], $data['MAIL_PORT'], $data['MAIL_ENCRYPTION'])) {
    http_response_code(400);
    echo json_encode(["error" => "Не все обязательные данные переданы"]);
    exit();
}

// Подготовка SQL-запроса для вставки данных
$sql = "INSERT INTO email_config (MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD, MAIL_PORT, MAIL_ENCRYPTION, account_name, user_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";

// Подготовка и выполнение запроса
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Ошибка на сервере"]);
    exit();
}

// Привязка параметров
$stmt->bind_param('sssissi', 
    $data['MAIL_HOST'], 
    $data['MAIL_USERNAME'], 
    $data['MAIL_PASSWORD'], 
    $data['MAIL_PORT'], 
    $data['MAIL_ENCRYPTION'],
    $data['account_name'],
    $user_id
);

// Выполнение запроса
if ($stmt->execute()) {
    echo json_encode(['message' => 'Настройки успешно сохранены']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка при сохранении данных']);
}

$stmt->close();
$conn->close();
?>
