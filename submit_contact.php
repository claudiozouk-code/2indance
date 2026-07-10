<?php
/**
 * submit_contact.php
 * Handles POST requests from the Contact Form and stores them in Hostinger MySQL.
 * 
 * Upload this file alongside db_connect.php to your Hostinger server.
 */

// Enable CORS so your React frontend can call this script from any domain
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get raw JSON payload
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Extract fields
    $name = isset($data['name']) ? trim($data['name']) : '';
    $email = isset($data['email']) ? trim($data['email']) : '';
    $message = isset($data['message']) ? trim($data['message']) : '';

    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => "Name, email, and message are required fields."
        ]);
        exit();
    }

    try {
        // 1. Create table automatically if it doesn't exist yet
        $createTableQuery = "CREATE TABLE IF NOT EXISTS contact_submissions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
        $pdo->exec($createTableQuery);

        // 2. Prepare and execute INSERT statement
        $stmt = $pdo->prepare("INSERT INTO contact_submissions (name, email, message) VALUES (:name, :email, :message)");
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':message' => $message
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Message successfully stored in Hostinger MySQL!",
            "id" => $pdo->lastInsertId()
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => "Database operation failed: " . $e->getMessage()
        ]);
    }
} else {
    // Handle simple GET to check if API is alive
    echo json_encode([
        "success" => true,
        "message" => "Hostinger 2inDance Contact API is online and ready for POST requests."
    ]);
}
?>
