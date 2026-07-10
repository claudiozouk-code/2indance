<?php
/**
 * db_connect.php
 * Hostinger MySQL Database Connection Configuration (PDO)
 * 
 * You can place this file in your Hostinger public_html folder.
 */

// Host name: srv2106.hstgr.io (remote) or localhost (when hosted directly on Hostinger)
$host = "srv2106.hstgr.io";
$port = 3306;
$username = "u906077841_claudiozouk";
$password = "@Just990717@";
$dbname = "u906077841_2indancenew";

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ATTR_ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Return structured JSON error response if connection fails
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Hostinger Database connection failed: " . $e->getMessage()
    ]);
    exit();
}
?>
