<?php

$conn = mysqli_connect("localhost", "root", "");
$dbase = mysqli_select_db($conn, "itec222");

if (!$conn || !$dbase) {
    die("Database connection failed: " . mysqli_connect_error());
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $posts = array();

    $select_query = "SELECT * FROM `posts`";

    $run_query = mysqli_query($conn, $select_query);

    if (mysqli_num_rows($run_query) > 0) {
        while ($row = mysqli_fetch_assoc($run_query)) {
            $posts[] = $row;
        }
        echo json_encode($posts);
    } else {
        echo json_encode(array("message" => "No posts found"));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method Not Allowed"));
}

mysqli_close($conn);

?>
