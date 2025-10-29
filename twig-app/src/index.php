<?php
require_once __DIR__ . '/../vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/templates');
$twig = new \Twig\Environment($loader,[
    'cache' => __DIR__ . '/../cache/twig',
    'auto_reload' => true,
]);

// Helper function to send JSON response
function sendJson($data, $status = 200) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Simple case based router: Add your routes here
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Protected routes that require authentication
$protectedRoutes = ['/dashboard', '/tickets'];

// Add cases for different routes and pass variables to the templates as needed
switch($path) {
    case '/':
    case '/home':
        echo $twig->render('landing.twig', [
            'title' => "Landing Page - Fix & Fast",
        ]);
        break;

    case '/dashboard':
    case '/tickets':
        // --- Server-side auth protection ---
        // We check for the session cookie. If it doesn't exist, redirect immediately.
        $isAuthenticated = isset($_COOKIE['ticketapp_session']);

        if (!$isAuthenticated) {
            // Not logged in. Send a redirect header and stop.
            // This happens before any HTML is sent, eliminating the flash.
            $redirectUrl = "/auth/login?redirect=" . urlencode($path);
            header("Location: " . $redirectUrl);
            exit;
        }
        // --- End server-side protection ---

        // If we get here, the user is authenticated.
        // Go ahead and render the protected page.
        echo $twig->render($path === '/dashboard'? 'dashboard.twig': 'ticketmanagement.twig', [
            'title' => ($path === '/dashboard'? "Dashboard": "Tickets"). " - Fix & Fast",
            'requiresAuth' => true
        ]);
        break;

    case '/auth/login':
        echo $twig->render('Auth/login.twig', [
            'title' => "Login - Fix & Fast",
            'redirectUrl' => $_GET['redirect'] ?? '/dashboard'
        ]);
        break;

    case '/auth/signup':
        echo $twig->render('Auth/signup.twig', [
            'title' => "Sign Up - Fix & Fast",
            'redirectUrl' => $_GET['redirect'] ?? '/dashboard'
        ]);
        break;

    default:
        echo $twig->render('404.twig', [
            'title' => "404 Not Found - Fix & Fast",
        ]);
};
?>