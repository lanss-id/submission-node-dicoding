const { addBooksHandler, getAllBooksHandler, detailBookHandler } = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: detailBookHandler
  }
]

module.exports = routes
