import express from "express"
import { PORT, mongoDbUrl } from "./config.js"
import mongoose from "mongoose"
import { Book } from "./models/bookModel.js"
import cors from 'cors'

const app = express()

// middleware for parsing request body
app.use(express.json())

// Middleware for handling CORS POLICY
// Option 1: Allow All Origins with Default of cors(*)
app.use(cors());
// Option 2: Allow Custom Origins
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send("Working...")
})

app.post('/books', async (request, response) => {
    try {
        if(!request.body.title || !request.body.author || !request.body.publishYear) {
            return response.status(400).send({ message: "Send all required fields data..."})
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        }

        const book = await Book.create(newBook)
        return response.status(201).send(book)

    } catch (error) {
        console.log(error.message)
        return response.status(500).send({ message: error.message })
    }
})

app.get('/books', async (request, response) => {
    try {
        const books = await Book.find({})

        return response.status(200).send({
            count: books.length,
            data: books
        })
    } catch (error) {
        console.log(error.message)
        return response.status(500).send({ message: error.message})
    }
})

app.get('/books/:id', async (request, response) => {
    try {
        const { id }= request.params
        const book = await Book.findById(id)

        return response.status(200).json(book)
    } catch (error) {
        console.log(error.message)
        return response.status(500).send({ message: error.message})
    }
})

app.put('/books/:id', async (request, response) => {
    try {
        if(!request.body.title || !request.body.author || !request.body.publishYear) {
            return response.status(400).send({ message: "Send all required fields: title, author and publish year"})
        }

        const { id } = request.params
        const result = await Book.findByIdAndUpdate(id, request.body)
        
        if(!result) {
            return response.status(404).send({ message: 'Book not found' })
        }

        return response.status(200).send({ message: 'Book updated succsesfully'})

    } catch (error) {
        console.log(error.message)
        return response.status(500).send({ message: error.message })
    }
})

app.delete('/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      const result = await Book.findByIdAndDelete(id);
  
      if (!result) {
        return response.status(404).json({ message: 'Book not found' });
      }
  
      return response.status(200).send({ message: 'Book deleted successfully' });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

mongoose.connect(mongoDbUrl)
    .then(() => {
        console.log("App connected to Database");
        app.listen(PORT, () => {
            console.log("App is listening to PORT 5555")
        });
    })
    .catch((error) => {
        console.log(error)
    })