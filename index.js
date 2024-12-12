const express = require('express');
const cors = require('cors');
const logger = require('./loggerMiddelWare');

const app = express();
// const corsOptions = {
//     origin: 'http://localhost:3000',  // El origen de tu frontend
//     methods: ['GET', 'POST', 'DELETE'], // Métodos que permites
//     allowedHeaders: ['Content-Type'], // Encabezados que permites
//   };
  

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

let notes = [
  {
    id: 1,
    body: 'HTML is easy',
    title: 'HTML is easy',
    userId: 1,
  },
  {
    id: 2,
    body: 'Browser can execute only JavaScript',
    title: '2019-04-30T19:20:298Z',
    userId: 1,
  },
  {
    id: 3,
    body: 'GET and POST are the most important methods of HTTP protocol',
    title:  'GET and POST are the most important methods of HTTP protocol',
    userId: 1,
  },
  {
    id: 4,
    body: 'React is pretty',
    title: 'React is pretty',
    userId: 1,
  },
];

// Routes
app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find(note => note.id === id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);
  res.status(204).end();
});

app.post('/api/notes', (req, res) => {
  const { body } = req.body;

  if (!body) {
    return res.status(400).json({
      error: 'note.body is missing',
    });
  }

  const maxId = Math.max(...notes.map(note => note.id));
  const newNote = {
    id: maxId + 1,
    body:body,
    title:body,
    userId:1,
  };

  notes = [...notes, newNote];
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (request, response) => {  
  const id = Number(request.params.id); // Obtiene el id de la URL  
  const updatedNote = request.body; // Obtiene los datos de la nota actualizada  

  // Verifica si los campos obligatorios están presentes  
  if (!updatedNote || !updatedNote.body || !updatedNote.title) {  
      return response.status(400).json({  
          error: 'Missing required fields: body, title, or userId'  
      });  
  }  

  // Encuentra la nota a actualizar  
  const noteIndex = notes.findIndex(note => note.id === id);  

  // Si no se encuentra la nota  
  if (noteIndex === -1) {  
      return response.status(404).json({  
          error: 'Note not found'  
      });  
  }  

  // Actualiza la nota  
  notes[noteIndex] = {  
      ...notes[noteIndex], // Mantiene los campos anteriores  
      body: updatedNote.body,  
      title: updatedNote.title,  
      userId: 1,  
  };  
  console.log(notes[noteIndex])
  // Responde con la nota actualizada  
  response.status(200).json(notes[noteIndex]);  
});  


// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
  });
});

// Server setup
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
