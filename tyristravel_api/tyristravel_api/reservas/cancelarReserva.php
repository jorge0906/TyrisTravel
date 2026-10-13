<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Vary: Origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit;
}

require_once("../config/database.php");

$data = json_decode(file_get_contents("php://input"), true);
$id_reserva = isset($data["id_reserva"]) ? (int)$data["id_reserva"] : 0;

if ($id_reserva <= 0) {
  http_response_code(400);
  echo json_encode(["error" => "id_reserva inválido"]);
  exit;
}

$query = "UPDATE reservas SET estado='cancelada' WHERE id_reserva=:id_reserva";
$stmt = $conn->prepare($query);
$stmt->bindParam(":id_reserva", $id_reserva, PDO::PARAM_INT);

if ($stmt->execute()) {
  echo json_encode(["message" => "Reserva cancelada"]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "No se pudo cancelar"]);
}
