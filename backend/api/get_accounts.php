<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Получаем данные из запроса (например, user_id)
$data = json_decode(file_get_contents('php://input'), true);
$user_id = isset($data['user_id']) ? $data['user_id'] : null;

if ($user_id) {
    // SQL-запрос на получение всех аккаунтов для конкретного пользователя
    $sql = "SELECT id, account_name, MAIL_USERNAME FROM email_config WHERE user_id = ? ORDER BY account_name ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    // Если user_id не передан, получаем все аккаунты
    $sql = "SELECT id, account_name, MAIL_USERNAME FROM email_config ORDER BY account_name ASC";
    $result = $conn->query($sql);
}

$accounts = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $accounts[] = $row;
    }

    echo json_encode($accounts, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([]); // Если аккаунтов нет
}

$conn->close();
?>
