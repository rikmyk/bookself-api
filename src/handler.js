const { nanoid } = require('nanoid');
const books = require('./books');


const addBookHandler = (request, h) => {
    const {
      name,year,author,summary,publisher,pageCount,readPage,reading,} = request.payload;

    if (!name) {
        const response = h.response({
            'status': 'fail',
            'message': 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;    
    }
    
    if (readPage > pageCount) {
        const response = h.response(
            {
                'status': 'fail',
                'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            });
        
            response.code(400);
            return response;
     }
     const id = nanoid(16);
     let finished = pageCount === readPage;
     const insertedAt = new Date().toISOString();
     const updatedAt = insertedAt;
     const newBook = {
         name,
         year,
         author,
         summary,
         publisher,
         pageCount,
         readPage,
         reading,
         id,
         finished,
         insertedAt,
         updatedAt,
    };
    
    books.push(newBook);
    
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
          },
        
      });
        
      response.code(201);
      return response;
    }
    const response = h.response({
      status: '',
      message: 'Buku gagal ditambahkan',
    });

    response.code(500);
    return response;
};

// kriteria 2 semua buku

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name || reading || finished) {
        let filteredBooks = [];

        if (name) {
            const filteredBooksWithName = books.filter((book) => {
                const nameRegex = new RegExp(name, 'gi');
                return nameRegex.test(book.name);
            });
            filteredBooks = [...filteredBooksWithName];
        }
        
        if (reading) {
            const filteredBooksWithReading = books.filter((book) => Number(book.reading) === Number(reading),
            );
            filteredBooks = [...filteredBooksWithReading];
        }

        if (finished) {
            const filteredBooksWithFinished = books.filter((book) => Number(book.finished) === Number(finished),
            );
            filteredBooks = [...filteredBooksWithFinished];
        }

        const response = h.response({
            'status': 'success',
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        'status': 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);

    return response;
};

// kriteria 3
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        },
        );
        response.code(200);
        return response;
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
      response.code(404);
      return response;
};

// kriteria 4
const updateBookByIdHandler = (request, h) => {

    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === bookId);

    const finished = pageCount === readPage

    if (name === undefined) {

      const response = h.response({

        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });

  

      response.code(400);
      return response;
    }

    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });


      response.code(400);
      return response;
    }

    if (index !== -1) {
        books[index] = {
          ...books[index],
            name,
            year,
            author,
            summary,
            publisher, 
            pageCount,
            readPage,
            reading,
            finished,
            updatedAt,
        };

        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });

        response.code(200);
        return response;
      }
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });

      response.code(404);
      return response;
};


// kriteria 5

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        
        const response = h.response({
            'status': 'success',
            'message': 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        'status': 'fail',
        'message': 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  };


module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };