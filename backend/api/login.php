<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Обрабатываем preflight-запрос (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);  // OK статус для OPTIONS
    exit();
}

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Метод не поддерживается"]);
    exit;
}

// Получаем данные из тела запроса
$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Проверка заполненности полей
if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Заполните все поля"]);
    exit;
}

// Экранируем email
$email = $conn->real_escape_string($email);

// Проверяем наличие пользователя в базе
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Проверка пароля
    if (password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true,
            "message" => "Добро пожаловать, {$user['email']}",
            "user" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "role" => $user['role'],  // Роль добавлена в ответ
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

// Закрытие соединения с базой данных
$conn->close();
?>
