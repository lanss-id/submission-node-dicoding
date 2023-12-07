const { nanoid } = require('nanoid')
const bookshelf = require('./bookshelf')

const addBooksHandler = (request, h) => {
  try {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    if (!name || name === '') {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku'
      }).code(400)
    }

    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      }).code(400)
    }

    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const finished = pageCount === readPage

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      createdAt,
      updatedAt: createdAt
    }

    bookshelf.push(newBook)

    const isSuccess = bookshelf.filter((book) => book.id === id).length > 0

    if (isSuccess) {
      return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      }).code(201)
    }
  } catch (error) {
    if (!error.response) throw error
    if (error.response.statusCode === 400) {
      return h.response({ message: 'bad request' }).code(400)
    }
    if (error.response.statusCode === 404) {
      return h.response({ message: 'data tidak ditemukan' }).code(404)
    }
    throw error
  }
}

const getAllBooksHandler = () => {
  try {
    const book = bookshelf.map(book => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }))
  
    return {
      status: 'success',
      data: {
        book
      }
    }
  } catch (error) {
    if (!error.response) throw error
    if (error.response.statusCode === 400) {
      return h.response({ message: 'bad request' }).code(400)
    }
    if (error.response.statusCode === 404) {
      return h.response({ message: 'data tidak ditemukan' }).code(404)
    }
    throw error
  }
}

const detailBookHandler = (request, h) => {
  try {
    const { bookId } = request.params
    const {detailBook : book} = bookshelf.find((book) => book.id === bookId)
    if (book) {
      const response = h.response({
        status: 'success',
        message: 'Detail Buku berhasil didapatkan',
        data: {
          book
        }
      })
      response.code(200)
      return response
    }
  } catch (error) {
    if (!error.response) throw error
    if (error.response.statusCode === 400) {
      return h.response({ message: 'bad request' }).code(400)
    }
    if (error.response.statusCode === 404) {
      return h.response({ status: 'fail', message: 'Buku tidak ditemukan' }).code(404)
    }
    throw error
  }
}

module.exports = { addBooksHandler, getAllBooksHandler, detailBookHandler }
