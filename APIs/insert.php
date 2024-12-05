<?php 
$conn = mysqli_connect("localhost", "root", "");
$dbase = mysqli_select_db($conn, "itec222");

$encoded_data = file_get_contents('php://input');
$decoded_data = json_decode($encoded_data, true);

$FullName = $decoded_data['FullName'];
$UserEmail = $decoded_data['UserEmail'];
$UserContact = $decoded_data['UserContact'];
$UserPassword = $decoded_data['UserPassword'];

$insert_query = "INSERT INTO `users` 
	(FullName, UserEmail, UserContact, UserPassword)
	VALUES ('$FullName', '$UserEmail', '$UserContact', '$UserPassword')";

	$run_query = mysqli_query($conn, $insert_query);

	if($run_query) {
		$message = "User Successfully Registered";
	} else {
		$message = "Something went wrong... Please try again";
	}
	
	$response[] = array("Message" => $message);
	echo json_encode($response);

	
?>