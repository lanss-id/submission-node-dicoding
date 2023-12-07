const { nanoid } = require('nanoid')
const bookshelf = require('./bookshelf')

const addBooksHandler = (request, h) => {
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
  const insertedAt = new Date().toISOString()
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
    insertedAt,
    updatedAt: insertedAt
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
}

const allBooksHandler = (request, h) => {
  const books = bookshelf.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  const { name, reading, finished } = request.query

  if (name) {
    books.filter(book => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (reading === '1') {
    books.filter(book => book.reading === (reading === false))
  }

  if (finished === '1') {
    books.filter(book => book.finished === (finished === false))
  }
  return {
    status: 'success',
    data: {
      books
    }
  }
}

const detailBookHandler = (request, h) => {
  const { bookId } = request.params
  const book = bookshelf.find((book) => book.id === bookId)
  if (!book) return h.response({ status: 'fail', message: 'Buku tidak ditemukan' }).code(404)
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

const updateBookHandler = (request, h) => {
  const { bookId } = request.params
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const index = bookshelf.findIndex((book) => book.id === bookId)

  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404)
  }

  bookshelf[index] = {
    ...bookshelf[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt
  }

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  }).code(200)
}

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params
  const index = bookshelf.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    bookshelf.splice(index, 1)
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  }).code(404)
}

module.exports = { addBooksHandler, allBooksHandler, detailBookHandler, updateBookHandler, deleteBookHandler }
