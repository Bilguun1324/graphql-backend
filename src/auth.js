const jwt = require("jsonwebtoken");

const verifyToken = async(resolve, _, __, context) => {
    const token = context.token

    if (!token) {
        throw new Error("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        return resolve(decoded)
    } catch (err) {
        throw new Error("Invalid Token");
    }
};

const auth = {
    Query: {
        books: verifyToken,
    },
    Mutation: {
        updateBook: verifyToken,
        deleteBook: verifyToken,
        addBook: verifyToken,
    }
}

module.exports = auth