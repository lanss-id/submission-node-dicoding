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
}

const getAllBooksHandler = () => {
  const book = bookshelf.map(book => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher
  }))

  if (!book) {
    return h.response({ message: 'data tidak ditemukan' }).code(404)
  }
  
  return {
    status: 'success',
    data: {
      book
    }
  }
}

const detailBookHandler = (request, h) => {
  const { bookId } = request.params;
  const book = bookshelf.find((book) => book.id === bookId);

  if (!book) {
    return h.response({ status: 'fail', message: 'Buku tidak ditemukan' }).code(404);
  }  

  const response = h.response({
    status: 'success',
    message: 'Detail Buku berhasil didapatkan',
    data: {
      book
    }
  });
  response.code(200);
  return response;
}

const updateBookHandler = (request, h) => {
  const {bookId} = request.params
  
}

module.exports = { addBooksHandler, getAllBooksHandler, detailBookHandler, updateBookHandler }
