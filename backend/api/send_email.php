<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Добавляем Authorization

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
    die(json_encode(['message' => 'Email configuration not found'])); // Не найдена конфигурация для указанного аккаунта
}

$config = $result->fetch_assoc();
$user_id = $config['user_id']; // Получаем user_id из конфигурации
$stmt->close();

// Подключаем Composer autoloader для PHPMailer
require_once __DIR__ . '/../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Настройка PHPMailer
$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';

// Разрешённые расширения и папка для загрузки
$allowedExtensions = ['pdf', 'txt', 'docx'];
$uploadDirectory = __DIR__ . '/../uploads/';
$filePathsToSave = []; // Массив для сохранённых путей

// Проверка и загрузка нескольких файлов
if (isset($_FILES['attachment']) && !empty($_FILES['attachment']['name'][0])) {
    foreach ($_FILES['attachment']['tmp_name'] as $key => $tmpName) {
        if ($_FILES['attachment']['error'][$key] === UPLOAD_ERR_OK) {
            $fileName = $_FILES['attachment']['name'][$key];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            if (!in_array($fileExtension, $allowedExtensions)) {
                die(json_encode(['message' => 'Invalid file type. Only PDF, TXT, and DOCX files are allowed.'])); // Неверный тип файла
            }

            $newFileName = uniqid() . '.' . $fileExtension;
            $destPath = $uploadDirectory . $newFileName;

            if (!move_uploaded_file($tmpName, $destPath)) {
                die(json_encode(['message' => 'Error uploading file: ' . $fileName])); // Ошибка при загрузке файла
            }

            $filePathsToSave[] = 'uploads/' . $newFileName;

            // Добавляем вложение в письмо
            $mail->addAttachment($destPath, $fileName);
        }
    }
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

    $mail->send();

    // Формируем строку для базы (пути через запятую)
    $attachmentsString = implode(',', $filePathsToSave);

    // Сохраняем историю отправки в базу
    $insertSql = "INSERT INTO email_history (account_id, recipient_email, subject, message, attachment_path, user_id)
                  VALUES (?, ?, ?, ?, ?, ?)";
    $insertStmt = $conn->prepare($insertSql);
    $insertStmt->bind_param('issssi', $account_id, $email, $subject, $message, $attachmentsString, $user_id);
    $insertStmt->execute();
    $insertStmt->close();

    echo json_encode(['message' => 'Message has been sent']); // Сообщение успешно отправлено
} catch (Exception $e) {
    echo json_encode(['message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo]); // Ошибка при отправке письма
}

?>
