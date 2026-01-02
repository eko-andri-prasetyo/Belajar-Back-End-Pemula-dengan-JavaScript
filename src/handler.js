import { nanoid } from 'nanoid';
import books from './books.js';

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher,
    pageCount, readPage, finished, reading,
    insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId: id },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) =>
      book.reading === !!Number(reading)
    );
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) =>
      book.finished === !!Number(finished)
    );
  }

  const responseBooks = filteredBooks.map(({ id, name, publisher }) => ({
    id, name, publisher,
  }));

  return {
    status: 'success',
    data: { books: responseBooks },
  };
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  if (book) {
    return {
      status: 'success',
      data: { book },
    };
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    books[index] = {
      ...books[index],
      name, year, author, summary, publisher,
      pageCount, readPage, reading, finished, updatedAt,
    };

    return {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    };
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};