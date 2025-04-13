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

// Проверка наличия необходимых данных в запросе
if (!isset($_POST['email'], $_POST['subject'], $_POST['message'], $_POST['account_id'])) {
    die(json_encode(['message' => 'Missing required fields']));
}

// Получаем данные из запроса
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];
$account_id = intval($_POST['account_id']); // Защита от SQL-инъекций

// Получение конфигурации почты по ID аккаунта
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

// Подключаем Composer autoloader для PHPMailer
require_once __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Настройка PHPMailer
$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';

// Проверка наличия файла и его типов
$allowedExtensions = ['pdf', 'txt', 'docx'];
$uploadDirectory = __DIR__ . '/../uploads/';
$destPath = '';

// Если файл был загружен
if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['attachment']['tmp_name'];
    $fileName = $_FILES['attachment']['name'];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    if (!in_array($fileExtension, $allowedExtensions)) {
        die(json_encode(['message' => 'Invalid file type. Only PDF, TXT, and DOCX files are allowed.']));
    }

    // Генерация уникального имени для файла
    $newFileName = uniqid() . '.' . $fileExtension;
    $destPath = $uploadDirectory . $newFileName;

    // Перемещение файла в папку uploads
    if (!move_uploaded_file($fileTmpPath, $destPath)) {
        die(json_encode(['message' => 'Error uploading file.']));
    }

    // Сохраняем в базу данных только относительный путь
    $filePathToSave = 'uploads/' . $newFileName;
} else {
    $filePathToSave = ''; // Если файла нет
}

// Настройка и отправка письма
try {
    // SMTP настройки
    $mail->isSMTP();
    $mail->Host = $config['MAIL_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['MAIL_USERNAME'];
    $mail->Password = $config['MAIL_PASSWORD'];
    $mail->SMTPSecure = $config['MAIL_ENCRYPTION'] === 'STARTTLS' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $config['MAIL_PORT'];

    $mail->setFrom($config['MAIL_USERNAME'], $config['account_name'] ?? 'Mailer');
    $mail->addAddress($email, 'Recipient');
    $mail->Subject = $subject;
    $mail->Body = $message;

    if ($filePathToSave) {
        $mail->addAttachment($uploadDirectory . basename($filePathToSave), $fileName);
    }

    $mail->send();

    // Сохраняем историю отправки в базу
    $insertSql = "INSERT INTO email_history (account_id, recipient_email, subject, message, attachment_path)
                  VALUES (?, ?, ?, ?, ?)";
    $insertStmt = $conn->prepare($insertSql);
    $insertStmt->bind_param('issss', $account_id, $email, $subject, $message, $filePathToSave);
    $insertStmt->execute();
    $insertStmt->close();

    echo json_encode(['message' => 'Message has been sent']);
} catch (Exception $e) {
    echo json_encode(['message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
}
?>
