<?php
// Разрешаем запросы с любого источника
header("Access-Control-Allow-Origin: *");
// Разрешаем методы
header("Access-Control-Allow-Methods: POST, OPTIONS");
// Разрешаем заголовки
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Указываем тип контента
header("Content-Type: application/json; charset=UTF-8");

// Обрабатываем preflight-запрос (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);  // OK статус
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

// Проверка существования пользователя
$email = $conn->real_escape_string($email);
$sql_check = "SELECT id FROM users WHERE email = '$email'";
$result_check = $conn->query($sql_check);

if ($result_check->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["error" => "Пользователь с таким email уже существует"]);
    exit;
}

// Хэшируем пароль
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Добавляем пользователя в базу данных
$sql = "INSERT INTO users (email, password) VALUES ('$email', '$hashedPassword')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Регистрация прошла успешно"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Ошибка при регистрации: " . $conn->error]);
}

// Закрытие соединения с базой данных
$conn->close();
?>
