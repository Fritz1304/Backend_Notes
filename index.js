require("dotenv").config();
const express = require("express");
const Note = require("./models/note");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(express.static("dist"));
app.use(cors());

let notes = [
]

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});
app.put("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = notes.find((note) => note.id === id);

  if (!note) {
    return response.status(404).json({
      error: "note not found",
    });
  }

  const updatedNote = {
    ...note,
    content: body.content,
    important: Boolean(body.important),
  };

  notes = notes.map((note) => (note.id === id ? updatedNote : note));

  response.json(updatedNote);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
