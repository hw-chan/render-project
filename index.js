require('dotenv').config()
const express = require("express");
const app = express();
const cors = require("cors");
var morgan = require("morgan");

const Person = require('./models/person')

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.get("/api/persons", (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
});

app.get("/info", (request, response) => {
  const numberOfPersons = persons.length;
  const currentTime = new Date().toString();

  const infoMessage = `
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentTime}</p>
  `;
  response.send(infoMessage);
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })  
    .catch(error => next(error))
}); 

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  
  person.save().then(result => {
    response.json(result)
  })
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error));
});

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
