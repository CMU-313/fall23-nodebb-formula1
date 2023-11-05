<!DOCTYPE html>
<html>
<head>
    <title>Thank You</title>
</head>
<body>
  <h1>Thank You</h1>

  <p>Thank you for submitting your bug report, <%= $_POST['name'] %>!</p>
  <p>We will investigate the bug and get back to you as soon as possible.</p>

  <p>Date of bug report: <%= $_POST['date'] %></p>

  <a href="/">Return to home page</a>
</body>
</html>
