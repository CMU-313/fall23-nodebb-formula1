<!DOCTYPE html>
<html>
<head>
  <title>Bug Report Form</title>
</head>
<body>
  <h1>Bug Report Form</h1>

  <form action="/submit-bug-report" method="POST" enctype="multipart/form-data">
    <input type="text" name="name" placeholder="Your name">
    <input type="date" name="date" placeholder="Date">
    <textarea name="description" placeholder="Description of the bug"></textarea>
    <input type="file" name="photo" accept="image/*">
    <button type="submit">Submit</button>
  </form>
</body>
</html>
