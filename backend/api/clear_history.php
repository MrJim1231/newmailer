<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Добавляем заголовок для авторизации

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Проверка что запрос — POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed']);
    exit();
}

// Подключение к базе данных и автозагрузчик
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// JWT настройки
$jwt_secret = "MY_SECRET_KEY"; // тот же секрет, что и в других скриптах

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

// Получаем все attachment_path из email_history для конкретного пользователя
$sql = "SELECT attachment_path FROM email_history h
        JOIN email_config c ON h.account_id = c.id
        WHERE c.user_id = ? AND (h.attachment_path IS NOT NULL AND h.attachment_path != '')";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Разбиваем строку с путями, если там несколько файлов
        $paths = explode(',', $row['attachment_path']);
        foreach ($paths as $path) {
            $filePath = __DIR__ . '/../' . ltrim($path, '/'); // формируем полный путь к файлу
            if (file_exists($filePath)) {
                unlink($filePath); // удаляем файл
            }
        }
    }
    // Закрываем результат запроса
    $stmt->close();
}

// Выполняем очистку таблицы email_history для конкретного пользователя
$deleteSql = "DELETE h FROM email_history h
              JOIN email_config c ON h.account_id = c.id
              WHERE c.user_id = ?";
$deleteStmt = $conn->prepare($deleteSql);
$deleteStmt->bind_param('i', $user_id);

if ($deleteStmt->execute()) {
    echo json_encode(['message' => 'Email history and attached files cleared successfully']);
} else {
    echo json_encode(['message' => 'Error clearing email history: ' . $conn->error]);
}

$deleteStmt->close();
$conn->close();
?>
