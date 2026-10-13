<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

require_once("../config/database.php");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$id_usuario = isset($data["id_usuario"]) ? (int)$data["id_usuario"] : 0;
$id_destino = isset($data["id_destino"]) ? (int)$data["id_destino"] : 0;

if ($id_usuario <= 0 || $id_destino <= 0) {
  http_response_code(400);
  echo json_encode(["error" => "Datos inválidos"]);
  exit;
}

$query = "INSERT INTO reservas (id_usuario, id_destino, estado) VALUES (:id_usuario, :id_destino, 'pendiente')";
$stmt = $conn->prepare($query);
$stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
$stmt->bindParam(":id_destino", $id_destino, PDO::PARAM_INT);

if ($stmt->execute()) {
  echo json_encode(["message" => "Reserva creada correctamente", "id_reserva" => $conn->lastInsertId()]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "No se pudo crear la reserva"]);
}

