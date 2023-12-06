const { nanoid } = require('nanoid')
const notes = require('./notes')

const addNotesHandler = (request, h) => {
  const { title, tags, body } = request.payload
  const id = nanoid(16)

  const createdAt = new Date().toISOString()
  const updatedAt = createdAt

  const newNote = {
    title, tags, body, id, createdAt, updatedAt
  }

  notes.push(newNote)

  const isSuccess = notes.filter((note) => note.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id
      }
    })
    response.code(201)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'catatan gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes
  }
})
const getDetailNotesHandler = (request, h) => {
  const {id} = request.params
  const detailNotes = notes.find((note) => note.id === id)
  if (detailNotes) {
    const response = h.response({
      status: 'success',
      message: 'Detail notes berhasil didapatkan',
      data: {
        detailNotes
      }
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Data tidak ditemukan, mohon periksa id anda',
  })
  response.code(404)
  return response
}

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params

  const { title, tags, body } = request.payload
  const updatedAt = new Date().toISOString()

  const index = notes.findIndex((note) => note.id === id)

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'data berhasil di update'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'gagal update data, id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params

  const index = notes.findIndex((note) => note.id === id)
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'data berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'data tidak berhasil dihapus, id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addNotesHandler, getAllNotesHandler, getDetailNotesHandler,editNoteByIdHandler, deleteNoteByIdHandler }
