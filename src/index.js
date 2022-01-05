const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const uri = process.env.URI;
const book = require("./bookSchema");
const User = require("./userSchema");

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

const resolvers = {
  Query: {
    books: async () => await book.find(),
  },
  Mutation: {
    async addBook(_, params) {
      const createBook = new book(params);

      try {
        await createBook.save();
        return createBook;
      } catch (err) {
        return err;
      }
    },
  },

  Mutation: {
    async updateBook(_, { _id, ...params }) {
      try {
        await book.findByIdAndUpdate(_id, params);
        return new book(params);
      } catch (err) {
        return err;
      }
    },
  },

  Mutation: {
    async deleteBook(_, _id) {
      try {
        await book.findByIdAndDelete(_id);
        return `deleted ${id}`;
      } catch (err) {
        return err;
      }
    },
  },

  Mutation: {
    async register(_, params) {
      try {
        const { first_name, last_name, email, password } = params;

        if (!(email && password && first_name && last_name)) {
          return "All input is required";
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
          return "user already exists";
        }
        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          first_name,
          last_name,
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
        });

        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        user.token = token;

        return user;
      } catch (err) {
        return err;
      }
    },
  },

  Mutation: {
    async login(_, params) {
      try {
        const { email, password } = params;

        if (!(email && password)) {
          return "All input is required";
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );

          user.token = token;

          return user;
        }
        return "Invalid Credentials";
      } catch (err) {
        console.log(err);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
