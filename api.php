<?php
/**
 * 2inDance - Hostinger Native PHP API
 * Handles all /api/* requests when deployed on Apache/Hostinger Shared Hosting with PHP & MySQL.
 */

// Enable Error Reporting for debugging if needed, but output clean JSON
error_reporting(0);
ini_set('display_errors', '0');

// CORS and Response Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Parse Route: either passed via ?route=... or REQUEST_URI
$route = isset($_GET['route']) ? trim($_GET['route'], '/') : '';
if (empty($route)) {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (preg_match('#^/api/(.*)$#', $uri, $matches)) {
        $route = trim($matches[1], '/');
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?? [];

// Database Connection Factory
function getDb() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $hosts = ['localhost', '127.0.0.1', 'srv2106.hstgr.io'];
    $dbName = 'u906077841_2indancenew';
    $dbUser = 'u906077841_claudiozouk';
    $dbPass = '@Just990717@';

    foreach ($hosts as $host) {
        try {
            $dsn = "mysql:host={$host};dbname={$dbName};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_TIMEOUT => 2
            ];
            $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
            return $pdo;
        } catch (Exception $e) {
            // continue trying next host
        }
    }
    return null;
}

// Master Admin Verification Helper
function verifyMasterAdmin($username, $password) {
    $user = strtolower(trim($username));
    $pass = trim($password);

    $isClaudio = ($user === 'claudiozouk' || $user === 'claudiozouk@gmail.com') && ($pass === '@Soassim2535' || $pass === '@Just990717@');
    $isAdmin = ($user === 'admin') && ($pass === '@Just990717@' || $pass === '@Soassim2535');

    return $isClaudio || $isAdmin;
}

// Route: admin/login
if ($route === 'admin/login' && $method === 'POST') {
    $user = $body['username'] ?? '';
    $pass = $body['password'] ?? '';

    // 1. Instant check for master admin credentials
    if (verifyMasterAdmin($user, $pass)) {
        echo json_encode([
            'success' => true,
            'token' => 'admin-secure-session-2indance-990717',
            'user' => [
                'username' => (strtolower(trim($user)) === 'admin') ? 'admin' : 'claudiozouk',
                'email' => 'claudiozouk@gmail.com'
            ]
        ]);
        exit();
    }

    // 2. Database check
    $pdo = getDb();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ? OR email = ? LIMIT 1");
            $stmt->execute([$user, $user]);
            $dbUser = $stmt->fetch();
            if ($dbUser && $pass === $dbUser['password']) {
                echo json_encode([
                    'success' => true,
                    'token' => 'admin-secure-session-2indance-990717',
                    'user' => [
                        'username' => $dbUser['username'],
                        'email' => $dbUser['email'] ?? 'claudiozouk@gmail.com'
                    ]
                ]);
                exit();
            }
        } catch (Exception $e) {}
    }

    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Usuário ou senha incorretos.']);
    exit();
}

// Route: db-status
if ($route === 'db-status') {
    $pdo = getDb();
    if ($pdo) {
        echo json_encode([
            'connected' => true,
            'message' => 'MySQL Conectado via Hostinger PHP!',
            'host' => 'localhost',
            'database' => 'u906077841_2indancenew'
        ]);
    } else {
        echo json_encode([
            'connected' => false,
            'message' => 'Modo Seguro Ativo (MySQL Hostinger em stand-by).'
        ]);
    }
    exit();
}

// Route: db-test
if ($route === 'db-test') {
    $pdo = getDb();
    if ($pdo) {
        echo json_encode([
            'success' => true,
            'connected' => true,
            'message' => 'Conexão MySQL estabelecida com sucesso no Hostinger!'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'connected' => false,
            'error' => 'Não foi possível conectar ao MySQL localmente.'
        ]);
    }
    exit();
}

// Route: frontpage
if ($route === 'frontpage') {
    $pdo = getDb();
    if ($method === 'POST') {
        if ($pdo) {
            try {
                $fields = [
                    'brand_name', 'brand_tagline', 'brand_description', 'brand_phone', 'brand_email', 'brand_locations',
                    'hero_title_line1', 'hero_title_line2', 'hero_title_line3', 'hero_subtitle', 'hero_cta_primary', 'hero_cta_secondary',
                    'hainan_badge', 'hainan_title', 'hainan_quote', 'hainan_link', 'social_instagram', 'social_facebook', 'social_youtube',
                    'social_whatsapp', 'footer_text', 'footer_disclaimer', 'logo_url', 'favicon_url', 'seo_title', 'seo_meta_description',
                    'seo_keywords', 'seo_og_image', 'seo_robots', 'google_site_verification', 'seo_custom_tags', 'hero_bg_type',
                    'hero_bg_image', 'hainan_logo_image', 'hainan_resort_image', 'hainan_room_image', 'hainan_beach_image', 'sections_order'
                ];
                $sets = [];
                $params = [];
                foreach ($fields as $f) {
                    if (isset($body[$f])) {
                        $sets[] = "{$f} = ?";
                        $params[] = $body[$f];
                    }
                }
                if (!empty($sets)) {
                    $sql = "UPDATE site_frontpage_settings SET " . implode(', ', $sets) . " WHERE id = 1";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute($params);
                }
                echo json_encode(['success' => true, 'message' => 'Frontpage updated in MySQL']);
                exit();
            } catch (Exception $e) {}
        }
        // Fallback: save to frontpage_cache.json
        @file_put_contents(__DIR__ . '/frontpage_cache.json', json_encode($body));
        echo json_encode(['success' => true, 'message' => 'Frontpage saved to cache']);
        exit();
    } else {
        // GET
        if ($pdo) {
            try {
                $stmt = $pdo->query("SELECT * FROM site_frontpage_settings WHERE id = 1 LIMIT 1");
                $data = $stmt->fetch();
                if ($data) {
                    echo json_encode(array_merge(['success' => true], $data));
                    exit();
                }
            } catch (Exception $e) {}
        }
        if (file_exists(__DIR__ . '/frontpage_cache.json')) {
            $cached = @file_get_contents(__DIR__ . '/frontpage_cache.json');
            if ($cached) {
                echo $cached;
                exit();
            }
        }
        echo json_encode([
            'success' => true,
            'brand_name' => '2inDance',
            'brand_tagline' => 'The Art of FusionDance in Motion',
            'brand_description' => 'Learn Brazilian Zouk, Lambada, and Samba with Xina and Laura in Hong Kong.',
            'seo_title' => '2inDance | Brazilian Zouk, Lambada & Samba Hong Kong'
        ]);
        exit();
    }
}

// Fallback for any other API route
echo json_encode(['success' => true, 'route' => $route, 'timestamp' => time()]);
