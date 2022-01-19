const { ApolloServer, gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");
const resolvers = require("./resolvers");
const mongoose = require("mongoose");
const auth = require("./auth");
const express = require("express");
require("dotenv").config();

const uri = process.env.URI;

mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const typeDefs = gql`
  type Book {
    _id: String
    title: String
    author: String
    comment: [String]
  }

  type User {
    first_name: String
    last_name: String
    email: String
    password: String
    token: String
  }

  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(title: String, comment: [String], author: String): Book
  }

  type Mutation {
    updateBook(
      _id: String
      title: String
      comment: [String]
      author: String
    ): Book
  }

  type Mutation {
    deleteBook(_id: String): String
  }

  type Mutation {
    register(
      first_name: String
      last_name: String
      email: String
      password: String
    ): User
  }

  type Mutation {
    login(email: String, password: String): User
  }
`;

const startApollo = async () => {
  const app = express();
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const middle = applyMiddleware(schema, auth);
  const server = new ApolloServer({
    schema: middle,
    context: (ctx) => {
      let token = ctx.req.headers.authorization;
      token = token.replace("Bearer ", "");
      return {
        token,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${process.env.PORT}`);
  });
};

startApollo();
