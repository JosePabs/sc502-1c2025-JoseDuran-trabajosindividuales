<?php
session_start();

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../config/db.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$userId = $_SESSION['user_id'];

// Obtener el método de la solicitud
$method = $_SERVER['REQUEST_METHOD'];

// Lee el cuerpo de la solicitud 
$data = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        // Obtener comentarios para una tarea específica
        if (isset($_GET['task_id'])) {
            $taskId = intval($_GET['task_id']);
            $stmt = $conn->prepare("SELECT id, text FROM comments ");
            $stmt->bind_param('i', $taskId);
            $stmt->execute();
            $result = $stmt->get_result();
            $comments = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($comments);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID de comentario no proporcionado']);
        }
        break;

    case 'POST':
        if (isset($data['task_id'], $data['text']) && !empty($data['text'])) {
            $taskId = intval($data['task_id']);
            $text = trim($data['text']);

            // Insertar comentario
            $stmt = $conn->prepare('INSERT INTO comments (task_id, text) VALUES (?, ?)');
            $stmt->bind_param('is', $taskId, $text);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al insertar comentario']);
            }

            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Datos inválidos']);
        }
        break;

    case 'DELETE':
        if (isset($data['id'])) {
            $commentId = intval($data['id']);
            $stmt = $conn->prepare("DELETE FROM comments WHERE id = ?");
            $stmt->bind_param('i', $commentId);

            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al eliminar comentario']);
            }

            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID de comentario no proporcionado']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
?>
