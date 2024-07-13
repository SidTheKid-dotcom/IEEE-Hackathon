# IEEE-Hackathon
This repo has been created for PISB's Hackathon 2024

This project is an Express.js application that uses Prisma ORM to interact with a PostgreSQL database. The application includes endpoints to create users and manage their favorite Pokémon.
Features

    User creation
    Adding favorite Pokémon for users
    Fetching user details along with their favorite Pokémon

Tech Stack

    Backend: Node.js, Express.js
    Database: PostgreSQL
    ORM: Prisma
    Version Control: Git

Prerequisites

    Node.js
    PostgreSQL
    Prisma CLI
    Git

Setup
1. Clone the Repository

git clonehttps://github.com/SidTheKid-dotcom/IEEE-Hackathon.git
cd IEEE-Hackathon

2. Install Dependencies

Navigate to the backend directory and install dependencies:

cd backend
npm install

3. Set Up Environment Variables

Create a .env file in the backend directory and add your database connection string:

plaintext

DATABASE_URL="your-database-connection-string"

4. Initialize Prisma

Generate Prisma client and migrate the database:

npx prisma generate
npx prisma migrate dev --name init

5. Start the Server

In the backend directory, start the server:

npm start


Contributing

    Fork the repository.
    Create a new branch: git checkout -b my-feature-branch.
    Make your changes and commit them: git commit -m 'Add some feature'.
    Push to the branch: git push origin my-feature-branch.
    Submit a pull request.
