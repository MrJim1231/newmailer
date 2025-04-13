<?php
// Заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Получаем всю историю писем
$sql = "SELECT * FROM email_history ORDER BY sent_at DESC";
$result = $conn->query($sql);

// Проверка, есть ли записи
if ($result->num_rows > 0) {
    $history = [];

    while ($row = $result->fetch_assoc()) {
        $history[] = $row;
    }

    echo json_encode($history);
} else {
    echo json_encode(['message' => 'No history found']);
}
?>
