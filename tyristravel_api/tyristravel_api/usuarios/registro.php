<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

require_once("../config/database.php");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$nombre = isset($data["nombre"]) ? trim($data["nombre"]) : "";
$email = isset($data["email"]) ? trim($data["email"]) : "";
$password = isset($data["password"]) ? (string)$data["password"] : "";

if ($nombre === "" || $email === "" || $password === "") {
  http_response_code(400);
  echo json_encode(["error" => "Todos los campos son obligatorios"]);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["error" => "Email inválido"]);
  exit;
}

$queryCheck = "SELECT id_usuario FROM usuarios WHERE email = :email LIMIT 1";
$stmtCheck = $conn->prepare($queryCheck);
$stmtCheck->bindParam(":email", $email, PDO::PARAM_STR);
$stmtCheck->execute();

if ($stmtCheck->rowCount() > 0) {
  http_response_code(409);
  echo json_encode(["error" => "El email ya está registrado"]);
  exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$query = "INSERT INTO usuarios (nombre, email, password) VALUES (:nombre, :email, :password)";
$stmt = $conn->prepare($query);
$stmt->bindParam(":nombre", $nombre, PDO::PARAM_STR);
$stmt->bindParam(":email", $email, PDO::PARAM_STR);
$stmt->bindParam(":password", $passwordHash, PDO::PARAM_STR);

if ($stmt->execute()) {
  echo json_encode([
    "id_usuario" => (int)$conn->lastInsertId(),
    "nombre" => $nombre,
    "email" => $email
  ]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "No se pudo registrar el usuario"]);
}
