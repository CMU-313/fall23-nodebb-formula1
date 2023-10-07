<!DOCTYPE html>
<html>
<head>
  <title>Bug Report Form</title>
</head>
<body>
  <h1>Bug Report Form</h1><br>

  <form action="/submit-bug-report" method="POST" enctype="multipart/form-data">
    <h4> <label for="name">Your name</label> </h4>
    <h6> (required) </h6>
    <input type="text" name="name" id="name" placeholder="Your name" required><br><br>

    <h4> <label for="date">Date</label> </h4>
    <h6> (required) </h6>
    <input type="date" name="date" id="date" placeholder="Date" required><br><br>

    <h4> <label for="description">Description of the bug</label> </h4>
    <h6> (required) </h6>
    <textarea name="description" id="description" placeholder="Description of the bug" required></textarea><br><br>

    <h4> <label for="description">Image of the bug</label> </h4>
    <input type="file" name="photo" id="photo" accept="image/*"><br><br>
    
    <button type="submit">Submit</button>
  </form>
</body>
</html>
