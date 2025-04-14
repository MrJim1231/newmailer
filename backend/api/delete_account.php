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
            $user_id = $decoded->sub;
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

// Получаем входящие данные
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'Не передан ID аккаунта']);
    exit;
}

$id = intval($data['id']);

// Удаляем аккаунт, только если он принадлежит пользователю
$sql = "DELETE FROM email_config WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id, $user_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Аккаунт успешно удалён']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Аккаунт не найден или не принадлежит вам']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при удалении аккаунта']);
}

$stmt->close();
$conn->close();
?>
