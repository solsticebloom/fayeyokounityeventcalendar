<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $eventName = $_POST['event-name'];
    $eventNotes = $_POST['event-notes'];
    $eventDate = $_POST['event-date'];

    // You can save this data into a database
    // For now, just displaying the data
    echo "Event Name: " . $eventName . "<br>";
    echo "Event Notes: " . $eventNotes . "<br>";
    echo "Event Date: " . $eventDate;
}
?>
