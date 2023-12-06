const { addNotesHandler, getAllNotesHandler, editNoteByIdHandler, deleteNoteByIdHandler, getDetailNotesHandler } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/notes',
    handler: addNotesHandler
  },
  {
    method: 'GET',
    path: '/notes',
    handler: getAllNotesHandler
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: getDetailNotesHandler
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: editNoteByIdHandler
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: deleteNoteByIdHandler
  }
]

module.exports = routes
