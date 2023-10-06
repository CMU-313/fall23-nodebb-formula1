<!DOCTYPE html>
<html>
<head>
  <title>Bug Report Form</title>
</head>
<body>
  <h1>Bug Report Form</h1>

  <form action="/submit-bug-report" method="POST" enctype="multipart/form-data">
    <label for="name">Your name</label><br>
    <input type="text" name="name" id="name" placeholder="Your name"><br>

    <label for="date">Date</label><br>
    <input type="date" name="date" id="date" placeholder="Date"><br>

    <label for="description">Description of the bug</label><br>
    <textarea name="description" id="description" placeholder="Description of the bug"></textarea><br>

    <input type="file" name="photo" id="photo" accept="image/*">
    <button type="submit">Submit</button>
  </form>
</body>
</html>
