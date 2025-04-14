<?php
// Заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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
$jwt_secret = "MY_SECRET_KEY"; // тот же секрет, что и в других скриптах
$jwt_issuer = "http://localhost:5173";

// Проверка авторизации через токен
$headers = apache_request_headers();
if (isset($headers['Authorization'])) {
    $authHeader = $headers['Authorization'];
    list($type, $token) = explode(" ", $authHeader);

    if ($type == "Bearer" && $token) {
        try {
            $decoded = JWT::decode($token, new Key($jwt_secret, 'HS256'));
            $user_id = $decoded->sub; // получаем user_id из токена
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Неверный токен']);
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

// Запрос истории отправленных писем для текущего пользователя
$sql = "SELECT h.id, h.recipient_email, h.subject, h.message, h.sent_at, 
               h.attachment_path, c.account_name, c.MAIL_USERNAME
        FROM email_history h
        JOIN email_config c ON h.account_id = c.id
        WHERE c.user_id = ? 
        ORDER BY h.sent_at DESC";

$stmt = $conn->prepare($sql);

// Проверка на ошибки при подготовке запроса
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка подготовки запроса']);
    exit();
}

$stmt->bind_param('i', $user_id); // Привязываем user_id
$stmt->execute();
$result = $stmt->get_result();

// Проверка на ошибки при выполнении запроса
if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка выполнения запроса']);
    exit();
}

$history = [];

// Проверяем, есть ли записи в истории
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $history[] = [
            'id' => $row['id'],
            'recipient_email' => $row['recipient_email'],
            'subject' => $row['subject'],
            'message' => $row['message'],
            'sent_at' => $row['sent_at'],
            'attachment_path' => $row['attachment_path'],
            'account_name' => $row['account_name'],
            'account_email' => $row['MAIL_USERNAME']
        ];
    }
    echo json_encode($history);
} else {
    echo json_encode(['message' => 'No email history found']);
}

$stmt->close();
$conn->close();

?>
