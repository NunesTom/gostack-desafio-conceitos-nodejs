const express = require("express");
const cors = require("cors");

// UUID - Universal Unique ID
const { uuid } = require("uuidv4"); 

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // Retornando todos os objetos da variavel global
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // Retorno da request
  const  { title , url, techs } = request.body;

  // Contrução do objeto de retorno
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  // Adicionando a variavel global
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title , url, techs } = request.body;
  const { id } = request.params;

  const findRepIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  if (findRepIndex === -1){
    return response.status(400).json({error: 'Repository not found.'});
  };

  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepIndex].likes,
  };

  repositories[findRepIndex] = repo;

  return response.json(repo);

});

app.delete("/repositories/:id", (request, response) => {
  // Deletar uma posição da variavel global
  const { id } = request.params;

  const findRepIndex = repositories.findIndex(repository => 
    repository.id === id
  );

  // Verifica se o indice procurado existe
  if (findRepIndex >= 0) {
    repositories.splice(findRepIndex, 1);
  } else {
    return response.status(400).json({ error: 'Repository not found.'})
  };

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  // Verifica se o indice procurado existe
  if (findRepIndex === -1) {
    return response.status(400).json({ error: 'Repository not found.' });
  };

  repositories[findRepIndex].likes ++;

  return response.json(repositories[findRepIndex]);
});

module.exports = app;
