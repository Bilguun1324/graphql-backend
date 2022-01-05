const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://new_user:qyBx2u3BYBpoyv86@cluster0.avkuj.mongodb.net/testing?retryWrites=true&w=majority";
const book = require("./bookSchema");

mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const typeDefs = gql`
  type Book {
    title: String
    author: String
    comment: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: async () => await book.find(),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
