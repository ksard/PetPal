# PetPal Backend

This is the backend part of the PetPal project. This document will guide you through the structure of the backend and provide instructions on how to install and run the project.

## Folder Structure

The backend of PetPal is organized to ensure modularity and clarity.

- The **config** directory contains configuration files like `database.js` for database setup and `helper.js` for helper functions.
- The **controllers** directory houses business logic for different functionalities, such as `adoptionController.js` for pet adoptions and `authController.js` for authentication.
- The **models** directory defines data schemas, including `petsModel.js` and `careTakersModel.js`.
- The **routes** directory maps endpoints to controllers, with files like `petRoutes.js` and `authRoutes.js`.
- Utility functions are located in the **utils** folder, such as `imageUtil.js` for image processing. Finally, `server.js` is the main entry point that initializes the server and middleware.

- **server.js**: The main entry point of the application. Initializes the server and sets up middleware.

## Installation

### Steps

1. Clone the repository from GitHub:

```sh
git clone https://github.com/infomediadesign/sad-01-24-petpal.git
cd server
```

2. Install dependencies:

```sh
npm install
```

3. Set up the database:
   Ensure your database is running and properly configured. Update the `config/database.js` file with your database credentials.

4. Start the server:

```sh
npm start
```
