const express = require('express')
const mongoose = require('mongoose')
const uri = 'mongodb+srv://new_user:qyBx2u3BYBpoyv86@cluster0.avkuj.mongodb.net/testing?retryWrites=true&w=majority'
const app = express()
const port = 5000
const blog = require('./bookSchema')

mongoose.connect(uri, { useNewUrlParser: true })
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.use(express.json()); 

app.get('/', function (req, res) {
    res.send('hello world')
})

app.get('/books', async (req, res) => {
    const blogs = await blog.find();
    res.send(blogs)
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
