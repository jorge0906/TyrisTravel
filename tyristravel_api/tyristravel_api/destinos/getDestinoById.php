<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once("../config/database.php");

$id = isset($_GET['id']) ? $_GET['id'] : 0;

$query = "SELECT d.*, c.nombre AS categoria 
          FROM destinos d
          LEFT JOIN categorias c ON d.id_categoria = c.id_categoria
          WHERE d.id_destino = :id";

$stmt = $conn->prepare($query);
$stmt->bindParam(":id", $id);
$stmt->execute();

$destino = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($destino);
?>
