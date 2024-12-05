<?php
        $encoded_data = file_get_contents('php://input');
        $decoded_data = json_decode($encoded_data, true);
        $postId = $decoded_data['id'];
        
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($decoded_data['id'])) {
        
        $pdo = new PDO("mysql:host=localhost;dbname=itec222", "root", "");


        

        $statement = $pdo->prepare("DELETE FROM `posts` WHERE post_id = :id");
        $statement->bindParam(':id', $postId);
        

        if ($statement->execute()) {
            echo json_encode(array("message" => "Post deleted successfully"));
        } else {
            echo json_encode(array("error" => "Failed to delete post"));
        }
    } else {
        echo json_encode(array("error" => "Post ID is required"));
    }
} else {
    echo json_encode(array("error" => "Invalid request method"));
}
?>