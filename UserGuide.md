# Introduction:

Welcome to Team Formula1’s NodeBB user guide. This user guide describes how to effectively use and test the different features added as part of the user stories implemented. These include the bug report form, and grouped posting. 

&nbsp;
# New Features Added:

&nbsp;

**Viewing the count of users online:**

<u>UsersOnlineonNodeBB</u>
To check the total number of users online, navigate to the Users page. The online count of all users on NodeBB is displayed in the brackets next to the “Online” tab (e.g. Online (10)).

<u>UsersOnlineinEachGroup</u>
To check the online users within each group (for groups you are a member of), navigate to the Group’s page. The count of users online within each group is displayed under the list of members, as “Currently Online: #”. 

&nbsp;

**Using the bug report form:**

To submit a bug report, navigate to the bug icon in the navigation bar (icon that is furthest to the right). Once on the page, there is a form that takes in name, description, and photo fields. Make sure to enter in your correct name, a detailed description of the bug, and a picture of the bug if necessary. All input fields are required except the photo input field. Next, click on the submit button. This will save your bug report form information so that administrators can see it and address it.

Future work can be done to develop a “bugs” controller to fetch the data from the backend and display it. All that needs to be done is to use the `db.getObjectFields` for all of the bugs in the database and to feed it to a `.tpl` file on the front end. Then, it is as simple as using the `.tpl` template and looping through each bug that it was supplied with.

&nbsp;

**Assigning a Topic to a Group:**

Begin by creating a new topic. Once a new topic is created navigate to the Ungrouped page (link with slash icon in navbar). Here you will see the list of ungrouped topics. All created topics will be moved here by default. To move/ assign a topic to a specific group click the assign to group icon. This will open a dropdown menu of the groups you are a member of. Once selected the topic will be moved to that specific group. This can be seen by navigating to the group details page.


<u>Possible bugs</u>

Previously groups were only used as labels so they do not contain group ids. In the event a group gets renamed the assigned topics will be lost since they are no longer linking to a valid group name.

<u>Additional Notes</u>

The group details page no longer displays response posts. This clutters up the screen and provides no value to the user. Now only topic/main posts that are assigned to the specific group are displayed in this page. The user can still view the replies by clicking on the main post link.

Originally we envisioned the ability to select/assign a group while creating the topic. However, the popup/form for creating posts and topics is handled inside of a Nodebb plugin. This would prevent us from using this method. The next best alternative was to create the ‘ungrouped’ page where users could assign topics to groups from there. 

&nbsp;
# Tests:

&nbsp;

**Running the tests:**

```
- Ensure the redis database is up and running with `redis-server`
- Flush the redis server with `redis-cli` and `flushdb`
- Run `./nodebb setup` and then `npm run test`
- Individual file tests case be run with `npx mocha test/{FILENAME}`

```

&nbsp;

**Online Count Tests**

The tests for the number of users online can be found in `test/user.js`. These tests check that the online user count displays the correct number. The tests that test for nonzero online user counts are currently commented out due to challenges in mocking the inward functions of our function that calculates the total number of online users. However, these can be uncommented and fixed in the future by figuring out how to create mock resolved values in NodeBB tests. 

&nbsp;

**Bug Report Tests**

The tests for the bug report can be found in `test/controllers.js`. These tests check that the post and create function for bugs functions as intended (mimic a report from the user). It also tests the get function for retrieving the latest submitted bug from the database. Note, however, that this test only works for redis when last checked (Does not pass all Github actions for postgres/mongo) so it is currently commented out. These are sufficient as they are the main functions that are being used in reporting and retrieving bugs. 

An additional manual test can be conducted for posting bugs to the database by using redis to show what bugs have been submitted. With a redis server instance running, type `redis-cli` followed by `keys *`. Then CTRL-F for “bug” and check that it exists. The properties of this object can be viewed by using `hgetall bug:{ID}`.

&nbsp;

**Group Posting Tests**

Tests are located at `test/controllers.js` and `tests/ungrouped.js`. They test whether or not `/ungrouped` pages load properly, newly created topics are viewed as “ungrouped”, and that assigned topics are no longer seen as 'ungrouped' and can be found in its assigned group's details page. These tests are sufficient for ensuring the main functionality of the feature behaves as expected.