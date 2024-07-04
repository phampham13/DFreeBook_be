const Book = require("../models/BookModel");
//const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createBook = (newBook) => {
  return new Promise(async (resolve, reject) => {
    const {
      bookId,
      name,
      coverImg,
      categoryName,
      quantityAvailable,
      quantityTotal,
    } = newBook;
    try {
      if (quantityAvailable > quantityTotal) {
        resolve({
          status: "ERR",
          message: "Sách sẵn có không thể nhiều hơn tổng",
        });
      }
      const checkBook = await Book.findOne({
        bookId: bookId,
      });
      if (checkBook !== null) {
        resolve({
          status: "ERR",
          message: "The book is already",
        });
      }

      const createBook = await Book.create(newBook);
      if (createBook) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createBook,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateBook = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkBook = await Book.findOne({
        _id: id,
      });
      if (checkBook === null) {
        resolve({
          status: "ERR",
          message: "The book is not define",
        });
      }

      if (checkBook.bookId !== data.bookId) {
        const checkBookId = await Book.find({
          bookId: data.bookId,
        });
        if (checkBookId.length !== 0) {
          resolve({
            status: "ERR",
            message: "The book ID already exists",
          });
        }
      }

      const updatedBook = await Book.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedBook,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteBook = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkBook = await Book.findOne({
        _id: id,
      });
      if (checkBook === null) {
        resolve({
          status: "ERR",
          message: "The book is not define",
        });
      }

      await Book.findByIdAndDelete(id, { new: true });
      resolve({
        status: "OK",
        message: "Delete book success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllBook = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalBook = await Book.countDocuments();
      let allBook = [];
      if (filter) {
        const label = filter[0];
        const allObjectFilter = await Book.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "OK",
          message: "Success",
          data: allObjectFilter,
          total: totalBook,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalBook / limit),
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allBookSort = await Book.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "OK",
          message: "Success",
          data: allBookSort,
          total: totalBook,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalBook / limit),
        });
      }
      if (!limit) {
        allBook = await Book.find().sort({ createdAt: -1, updatedAt: -1 });
      } else {
        allBook = await Book.find()
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }
      resolve({
        status: "OK",
        message: "Success",
        data: allBook,
        total: totalBook,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalBook / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAll = (limit, page, categoryName, keyword) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};

      if (categoryName) {
        query.categoryName = categoryName;
      }

      if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: "i" } },
          { author: { $regex: keyword, $options: "i" } }
        ];
      }

      const totalBooks = await Book.countDocuments(query);

      const books = await Book.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1, updatedAt: -1 });

      resolve({
        status: "OK",
        message: "Success",
        data: books,
        total: totalBooks,
        pageCurrent: Number(page),
        totalPage: Math.ceil(totalBooks / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailBook = (bookId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const book = await Book.findOne({
        bookId: bookId,
      });
      if (book === null) {
        resolve({
          status: "ERR",
          message: "The book is not define",
        });
      }

      resolve({
        status: "OK",
        message: "Get detail success",
        data: book,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyBook = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Book.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete books success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getAllBook,
  getAll,
  getDetailBook,
  deleteManyBook,
};
