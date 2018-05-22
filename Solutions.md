# NewsIT - News Sentiment Analysis App

**Team Members:**

Name: Yushan Lin Student #: 1001713336 Github User Joined: yu-linn Github Account: Yushan-Lin

Name: Ambarish Gugilla Student #: 1001344609

Name: Ramya Prasad Student #: 1001441068

Name: Raymond Choi Student #: 1001649709


**Instructions for Running App:**

1. Npm install
2. Run node app.js
3. View app on http://localhost:5000/

**Features & Usability:**

The main page of the website displays the top 20 headlines today in the U.S. The user can search for a specific topic on the top right hand corner by clicking the search button. They can filter their search options by clicking advanced search (Drop down menu) and sort the list based on date, popularity, relevance and/or language. Since the search option is the key feature it is easily accessible on every page of the site. When scrolling, articles are automatically loaded as the user scrolls down further. The user can click on any of the article previews and will be redirected to the source to view the entire article. 

The side menu bar has options for Search, Sign Up and Login. When the user signs in, they are redirected to their personalized dashboard. Creating an account allows the user to save their desired topics and keep a record of the sentiment of the topic in the Saved Topics tab. 

When the user searches, they will see an add topic button that will allow them to save the topic. Users can only save topics once they have logged in. Users can view their list of saved topics in the Saved Topics tab. They have the option to delete the topic from their personalized list. The user can click on the topic and a input box appears for the user to input the past number of days the user wants to view for the sentiment history of the topic. When the user enters, a graph will show the sentiment history of the topic so the user can see the changes in the sentiment over the desired number of days inputted.

The user will also be able to delete their account if desired.

Session management allows users to reopen a closed window and still have the personalized dashboard and Saved Topics tab available. Once the user logs out, they will be redirected to the public page and the session is destroyed. 

**Roles of End-users:**

End-users can organize news topics they are interested in and can easily access entire articles that are filtered to their liking. By having an account they have the added benefit of viewing the sentiment analysis graph of the topic to see how well or poorly the topic has been expressed in the media. This is a great tool for tracking companies and topics users have invested in. 

**REST Operations:**

**GET:** Users can get the list of articles of the topic they search for. They can also get the list of topics the saved as well. When a GET request is made on /api/ the website loads with the logged in user’s topics, name, and username. If not logged in, the website loads, but no user info is returned.

**POST:** Users are added to the list of users that exists when they sign up, which is done by POST the information

**PUT:** Users can add the topics they want to keep track of through the save command. Which is done through a PUT request from /api/users/:user/topics/:topic. On success a 200 status code is returned. If the user enters a user that does not exists a 404 status code is returned and if the user is not logged in a 401 status code is returned.

**DELETE:** Users can delete topics from their list. Which is done through a DELETE request from /api/users/:user/topics/:topic. On success a 202 status code is returned. If the user enters a user that does not exists a 404 status code is returned and if the user is not logged in a 401 status code is returned. Users can also delete their own accounts through a DELETE request from /api/users/:user. On success a 202 status code is returned.

**CRUD Operations:**

**CREATE:** User can CREATE the account and save it to the database.

**READ:** The application looks up the user in the database and READS the list of saved topics to display the list of topics they saved.

**UPDATE:** The user can UPDATE their list of topics in the database by adding new topics.

**DELETE:** The user can DELETE the topic on their saved topics list in the database as well.



