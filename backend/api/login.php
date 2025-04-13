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
$jwt_secret = "MY_SECRET_KEY"; // ❗ Используй надёжный секрет в проде
$jwt_issuer = "http://localhost:5173";
$jwt_lifetime = 3600; // 1 час

// Только POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Метод не поддерживается"]);
    exit;
}

// Получаем JSON из тела
$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Заполните все поля"]);
    exit;
}

// Экранируем email
$email = $conn->real_escape_string($email);

// Проверяем наличие пользователя
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if (password_verify($password, $user['password'])) {
        // Генерация токена
        $issuedAt = time();
        $expiresAt = $issuedAt + $jwt_lifetime;

        $payload = [
            "iss" => $jwt_issuer,
            "iat" => $issuedAt,
            "exp" => $expiresAt,
            "sub" => $user['id'],
            "email" => $user['email'],
            "role" => $user['role']
        ];

        $jwt = JWT::encode($payload, $jwt_secret, 'HS256');

        echo json_encode([
            "success" => true,
            "message" => "Добро пожаловать, {$user['email']}",
            "token" => $jwt,
            "user" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "role" => $user['role'],
                "created_at" => $user['created_at']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Неверный пароль"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Пользователь не найден"]);
}

$conn->close();
?>
