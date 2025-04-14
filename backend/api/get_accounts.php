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
// Подключение к базе данных и автозагрузчик
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// JWT настройки
$jwt_secret = "MY_SECRET_KEY"; // такой же секрет как в другом скрипте
$jwt_issuer = "http://localhost:5173";

// Проверка авторизации через токен
$headers = apache_request_headers();
if (isset($headers['Authorization'])) {
    $authHeader = $headers['Authorization'];
    list($type, $token) = explode(" ", $authHeader);

    if ($type == "Bearer" && $token) {
        try {
            $decoded = JWT::decode($token, new Key($jwt_secret, 'HS256'));
            $user_id = $decoded->sub;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Токен не предоставлен или неверный']);
            exit();
        }
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Неверный формат токена']);
        exit();
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Токен не предоставлен']);
    exit();
}

// Получение аккаунтов пользователя
$sql = "SELECT id, account_name, MAIL_USERNAME FROM email_config WHERE user_id = ? ORDER BY account_name ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

$accounts = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $accounts[] = $row;
    }
    echo json_encode($accounts, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([]);
}

$conn->close();
?>
