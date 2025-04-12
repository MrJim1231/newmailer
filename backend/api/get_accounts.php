<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// SQL-запрос на получение всех аккаунтов
$sql = "SELECT id, account_name, MAIL_USERNAME FROM email_config ORDER BY account_name ASC";
$result = $conn->query($sql);

$accounts = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $accounts[] = $row;
    }

    echo json_encode($accounts, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([]);
}

$conn->close();
?>
