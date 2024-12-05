<?php 
$conn = mysqli_connect("localhost", "root", "");
$dbase = mysqli_select_db($conn, "itec222");

$encoded_data = file_get_contents('php://input');
$decoded_data = json_decode($encoded_data, true);

$user_name = $decoded_data['user_name'];
$post_text = $decoded_data['post_text'];


$insert_query = "INSERT INTO `posts` 
	(user_name, post_text) VALUES ('$user_name', '$post_text')";

	$run_query = mysqli_query($conn, $insert_query);

	if($run_query) {
		$message = "Post Stored";
	} else {
		$message = "Something went wrong... Please try again";
	}
	
	$response[] = array("Message" => $message);
	echo json_encode($response);

	
?>