<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once("../config/database.php");

$id_usuario = isset($_GET["id_usuario"]) ? (int)$_GET["id_usuario"] : 0;

if ($id_usuario <= 0) {
  http_response_code(400);
  echo json_encode(["error" => "id_usuario es requerido"]);
  exit;
}

$query = "
  SELECT 
    r.id_reserva,
    r.id_usuario,
    r.id_destino,
    r.fecha_reserva,
    r.estado,
    d.nombre AS destino_nombre,
    d.descripcion AS destino_descripcion,
    d.precio AS destino_precio,
    d.imagen_url AS destino_imagen_url,
    c.nombre AS categoria_nombre
  FROM reservas r
  INNER JOIN destinos d ON d.id_destino = r.id_destino
  LEFT JOIN categorias c ON c.id_categoria = d.id_categoria
  WHERE r.id_usuario = :id_usuario
  ORDER BY r.fecha_reserva DESC
";

$stmt = $conn->prepare($query);
$stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
