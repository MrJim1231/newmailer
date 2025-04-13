<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Получаем все attachment_path из email_history
$sql = "SELECT attachment_path FROM email_history WHERE attachment_path IS NOT NULL AND attachment_path != ''";
$result = $conn->query($sql);

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
}

// Выполняем очистку таблицы email_history
$deleteSql = "DELETE FROM email_history";

if ($conn->query($deleteSql) === TRUE) {
    echo json_encode(['message' => 'Email history and attached files cleared successfully']);
} else {
    echo json_encode(['message' => 'Error clearing email history: ' . $conn->error]);
}

$conn->close();
?>
