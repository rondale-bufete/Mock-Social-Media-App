<?php 
$conn = mysqli_connect("localhost", "root", "");
$dbase = mysqli_select_db($conn, "itec222");

$encoded_data = file_get_contents('php://input');
$decoded_data = json_decode($encoded_data, true);

$UserId = $decoded_data['UserId'];
$FullName = $decoded_data['FullName'];
$UserEmail = $decoded_data['UserEmail'];
$UserContact = $decoded_data['UserContact'];

$update_query = "UPDATE `users` SET 
	FullName = '$FullName', 
	UserEmail = '$UserEmail', 
	UserContact = '$UserContact' 
	WHERE UserId = '$UserId'";

$run_query = mysqli_query($conn, $update_query);

if($run_query) {
	$message = "User Successfully Updated";
} else {
	$message = "Something went wrong... Please try again";
}

$response[] = array("Message" => $message);
echo json_encode($response);

?>
