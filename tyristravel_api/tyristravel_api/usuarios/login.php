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

$email = isset($data["email"]) ? trim($data["email"]) : "";
$password = isset($data["password"]) ? (string)$data["password"] : "";

if ($email === "" || $password === "") {
  http_response_code(400);
  echo json_encode(["error" => "Email y password son obligatorios"]);
  exit;
}

$query = "SELECT id_usuario, nombre, email, password FROM usuarios WHERE email = :email LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->bindParam(":email", $email, PDO::PARAM_STR);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
  http_response_code(401);
  echo json_encode(["error" => "Credenciales incorrectas"]);
  exit;
}

$stored = (string)$user["password"];

$ok = false;
if (password_verify($password, $stored)) {
  $ok = true;
} else {
  if ($password === $stored) {
    $ok = true;
  }
}

if (!$ok) {
  http_response_code(401);
  echo json_encode(["error" => "Credenciales incorrectas"]);
  exit;
}

echo json_encode([
  "id_usuario" => (int)$user["id_usuario"],
  "nombre" => $user["nombre"],
  "email" => $user["email"]
]);
