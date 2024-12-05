<?php

$conn = mysqli_connect("localhost", "root", "");
$dbase = mysqli_select_db($conn, "itec222");

$encoded_data = file_get_contents('php://input');
$decoded_data = json_decode($encoded_data, true);

$findUser = $decoded_data['email'];
$password = $decoded_data['password'];

$select_query = "SELECT * FROM `users` WHERE UserEmail = '$findUser' AND UserPassword = '$password'";

$run_query = mysqli_query($conn, $select_query);

if (mysqli_num_rows($run_query) > 0) {
    $row = mysqli_fetch_assoc($run_query);
    $response = array(
        "UserId" => $row['UserId'],
        "FullName" => $row['FullName'],
        "UserEmail" => $row['UserEmail'],
        "UserContact" => $row['UserContact'],
        "UserPassword" => $row['UserPassword']
    );
} else {
    $response = array("error" => "Invalid credentials");
}

echo json_encode($response);
?>