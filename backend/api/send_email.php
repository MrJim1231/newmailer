<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Подключение к базе данных
require_once __DIR__ . '/../includes/db.php';

// Получаем данные из запроса
$data = json_decode(file_get_contents('php://input'), true);

// Проверка обязательных полей
if (!isset($data['email'], $data['subject'], $data['message'], $data['account_id'])) {
    die(json_encode(['message' => 'Missing required fields']));
}

// Получение конфигурации почты по ID аккаунта
$account_id = intval($data['account_id']); // Защита от SQL-инъекций
$sql = "SELECT * FROM email_config WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $account_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    die(json_encode(['message' => 'Email configuration not found']));
}

$config = $result->fetch_assoc();
$stmt->close();

// Подключаем Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Настройка PHPMailer
$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8'; // 👈 Обязательно, чтобы поддерживать кириллицу

try {
    $mail->isSMTP();
    $mail->Host = $config['MAIL_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['MAIL_USERNAME'];
    $mail->Password = $config['MAIL_PASSWORD'];
    $mail->SMTPSecure = $config['MAIL_ENCRYPTION'] === 'STARTTLS' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $config['MAIL_PORT'];

    $mail->setFrom($config['MAIL_USERNAME'], $config['account_name'] ?? 'Mailer');
    $mail->addAddress($data['email'], 'Recipient');
    $mail->Subject = $data['subject'];
    $mail->Body = $data['message'];

    $mail->send();
    echo json_encode(['message' => 'Message has been sent']);
} catch (Exception $e) {
    echo json_encode(['message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
}
?>
