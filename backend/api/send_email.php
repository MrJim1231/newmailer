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

// Запрос к базе данных для получения конфигурации почты
$sql = "SELECT * FROM email_config LIMIT 1";  // Или используйте другой запрос, чтобы извлечь нужную запись
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $config = $result->fetch_assoc();
} else {
    die(json_encode(['message' => 'Email configuration not found']));
}

// Получаем данные из запроса
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email'], $data['subject'], $data['message'])) {
    die(json_encode(['message' => 'Missing required fields']));
}

// Подключаем Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Настройка PHPMailer
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $config['MAIL_HOST'];  // Берем значения из базы данных
    $mail->SMTPAuth = true;
    $mail->Username = $config['MAIL_USERNAME'];
    $mail->Password = $config['MAIL_PASSWORD'];
    $mail->SMTPSecure = $config['MAIL_ENCRYPTION'] == 'STARTTLS' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SSL;
    $mail->Port = $config['MAIL_PORT'];

    $mail->setFrom($config['MAIL_USERNAME'], 'Mailer');
    $mail->addAddress($data['email'], 'Recipient');
    $mail->Subject = $data['subject'];
    $mail->Body = $data['message'];

    $mail->send();
    echo json_encode(['message' => 'Message has been sent']);
} catch (Exception $e) {
    echo json_encode(['message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
}
?>
