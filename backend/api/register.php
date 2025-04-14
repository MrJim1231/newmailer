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

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Только POST-запрос
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Метод не поддерживается"]);
    exit;
}

// Получаем данные из тела запроса
$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'user'; // по умолчанию 'user'

// Проверка полей
if (empty($email) || empty($password)) {
    echo json_encode(["success" => false, "error" => "Заполните все поля"]);
    exit;
}

// Проверка существования пользователя
$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Пользователь с таким email уже существует"]);
    $checkStmt->close();
    exit;
}
$checkStmt->close();

// Хешируем пароль
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Вставка нового пользователя
$insertStmt = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
$insertStmt->bind_param("sss", $email, $hashedPassword, $role);

if ($insertStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Регистрация прошла успешно"]);
} else {
    echo json_encode(["success" => false, "error" => "Ошибка при регистрации: " . $conn->error]);
}

$insertStmt->close();
$conn->close();
?>
