<!DOCTYPE html>
<html>
<head>
  <title>Bug Report Form</title>
</head>
<body>
  <h1>Bug Report Form</h1><br>

  <form action="/submit-bug-report" method="POST">
    <h4> <label for="name">Your name</label> </h4>
    <input type="text" name="name" id="name" placeholder="Your name"><br><br>

    <h4> <label for="email">Email</label> </h4>
    <input type="email" name="email" id="email" placeholder="Email"><br><br>

    <h4> <label for="date">Date</label> </h4>
    <input type="date" name="date" id="date" placeholder="Date"><br><br>

    <h4> <label for="description">Description of the bug</label> </h4>
    <textarea name="description" id="description" placeholder="Description of the bug"></textarea><br><br>

    <h4> <label for="description">Image of the bug</label> </h4>
    <input type="file" name="photo" id="photo" accept="image/*"><br><br>
    
    <button component="bug/report" class="btn btn-primary btn-lg btn-block" id="login" type="submit">Submit</button>
  </form>
</body>
</html>
