<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Получаем историю отправок с данными аккаунта и пути к документу
$sql = "SELECT h.id, h.recipient_email, h.subject, h.message, h.sent_at, 
               h.attachment_path, c.account_name, c.MAIL_USERNAME
        FROM email_history h
        JOIN email_config c ON h.account_id = c.id
        ORDER BY h.sent_at DESC";

$result = $conn->query($sql);

$history = [];

while ($row = $result->fetch_assoc()) {
    $history[] = [
        'id' => $row['id'],
        'recipient_email' => $row['recipient_email'],
        'subject' => $row['subject'],
        'message' => $row['message'],
        'sent_at' => $row['sent_at'],
        'attachment_path' => $row['attachment_path'],
        'account_name' => $row['account_name'],
        'account_email' => $row['MAIL_USERNAME']
    ];
}

echo json_encode($history);
?>
