<?php
// Разрешаем запросы с любого источника
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$jwt_secret = "MY_SECRET_KEY";
$jwt_issuer = "http://localhost:5173";
$jwt_lifetime = 3600;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Метод не поддерживается"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'user';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Заполните все поля"]);
    exit;
}

$email = $conn->real_escape_string($email);
$sql_check = "SELECT id FROM users WHERE email = '$email'";
$result_check = $conn->query($sql_check);

if ($result_check->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["error" => "Пользователь с таким email уже существует"]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$sql = "INSERT INTO users (email, password, role) VALUES ('$email', '$hashedPassword', '$role')";

if ($conn->query($sql) === TRUE) {
    $user_id = $conn->insert_id;
    $created_at = date("Y-m-d H:i:s");

    // Формируем payload для токена
    $issuedAt = time();
    $expiresAt = $issuedAt + $jwt_lifetime;

    $payload = [
        "iss" => $jwt_issuer,
        "iat" => $issuedAt,
        "exp" => $expiresAt,
        "sub" => $user_id,
        "email" => $email,
        "role" => $role
    ];

    $jwt = JWT::encode($payload, $jwt_secret, 'HS256');

    echo json_encode([
        "success" => true,
        "message" => "Регистрация прошла успешно",
        "token" => $jwt,
        "user" => [
            "id" => $user_id,
            "email" => $email,
            "role" => $role,
            "created_at" => $created_at
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Ошибка при регистрации: " . $conn->error]);
}

$conn->close();
?>
