# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


# Fetch Rewards Login Page

A pretty simple login form page using React & Bootstrap React

NPM (node packet manager) was used to install all necessary dependencies - hopefully all obsolete packages were removed

# Install / Run

Instructions for Windows:

Download [NPM] (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Download entire repository into a local folder (Node_modules dependencies are not included in GitHub repository due to size)

Via terminal (i.e. text/powershell/command line), change directory to top level of downloaded repository

In the terminal, install dependencies included in package.json / package-lock.json. **Install dependencies by calling "npm install" from the terminal **

In the terminal, run "npm start" to launch localhost deployment of web page

# Misc notes on project

Password is hashed to avoid sending plaintext - HTTPS makes it a bit moot but transmitting / storing plaintext password is a no-no

	
# Nice to have future additions

Currently relying on default browser styling for form validation - visual customization of that would be a nice addition

Form submission showing a confirmation of success (animated image of some kind) and then redirecting user to another web page - a logged in user page for example.

Could further genericize entryfield and dropdown components, entire form as component as well. External files for each rather than having all in App.js

Code comments in App.js outline a few specific areas to improve - external files for components, UI flourishes.

I spent only a little time on making it "pretty" - images, animations, etc would all be delightful in a polished web page. As is mainly made sure it is responsive on different size screens (and added a nav banner and centered gutter)