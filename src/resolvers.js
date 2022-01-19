const book = require("./bookSchema");
const User = require("./userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    async updateBook(_, { _id, ...params }) {
      try {
        await book.findByIdAndUpdate(_id, params);
        return new book(params);
      } catch (err) {
        return err;
      }
    },

    async deleteBook(_, _id) {
      try {
        await book.findByIdAndDelete(_id);
        return `deleted ${id}`;
      } catch (err) {
        return err;
      }
    },

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

        user.token = token
        console.log(user)

        return user;
      } catch (err) {
        return err;
      }
    },

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
          console.log(user)

          return user;
        }
        return "Invalid Credentials";
      } catch (err) {
        console.log(err);
      }
    },
  },
};


module.exports = resolvers