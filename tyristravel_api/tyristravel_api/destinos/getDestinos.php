<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once("../config/database.php");

$query = "SELECT d.*, c.nombre AS categoria 
          FROM destinos d
          LEFT JOIN categorias c ON d.id_categoria = c.id_categoria
          WHERE d.activo = 1";

$stmt = $conn->prepare($query);
$stmt->execute();

$destinos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($destinos);
?>
