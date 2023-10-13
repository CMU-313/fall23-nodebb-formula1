<!DOCTYPE html>
<html>
<head>
  <title>Bug List</title>
</head>
<body>
      <!-- IF !loggedIn-->
        <p>Please log in to access this section.</p>
      <!-- ENDIF !loggedIn -->

      <!-- IF loggedIn-->
        <!-- IF !isAdminOrMod-->
          <!-- IMPORT 'themes/nodebb-theme-persona/templates/bug-form.tpl -->
        <!-- ENDIF !isAdminOrMod-->
      <!-- ENDIF loggedIn-->

      <!-- IF loggedIn -->
          <!-- IF isAdminOrMod -->
            <p>You are an Admin</p>
          <!-- ENDIF isAdminOrMod -->
      <!-- ENDIF loggedIn -->
</body>
</html>
