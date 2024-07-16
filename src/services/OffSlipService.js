const OffBorrowerSlip = require("../models/OffBorrowerSlipModel");
const Book = require("../models/BookModel");
const User = require("../models/UserModel");
const BlockedPhone = require("../models/BlockedPhoneModel");
const OnBorrowerSlip = require("../models/BorrowerSlipModel");
const ViolationCheck = require("../services/ViolationCheck")

const createBorrowerSlip = (newBorrowerSlip) => {
  return new Promise(async (resolve, reject) => {
    const { name, phoneNumber, bookIds, totalAmount } = newBorrowerSlip;
    try {
      const checkBlockedUser = await BlockedPhone.findOne({
        phoneNumber: phoneNumber,
      });
      if (checkBlockedUser !== null) {
        return resolve({
          status: "ERR",
          message: "Bạn đọc phạm quy, kiểm tra lại phiếu mượn",
        });
      }
      /**: check số lượng sách đang mượn và số sách hiện tại có vượt quá không */
      const borroweredSlips = await OffBorrowerSlip.find({
        phoneNumber: phoneNumber,
        state: { $in: [1] },
      });

      if (borroweredSlips.length > 0) {
        const count = borroweredSlips.reduce((count, slip) => {
          return count + slip.totalAmount;
        }, 0);
        if (count + totalAmount > 3) {
          return resolve({
            status: "ERR",
            message: `Bạn đọc đã mượn ${count} quyển, không thể mượn cùng lúc nhiều hơn 3`,
          });
        }
      }

      /**Kiểm tra số lượng sách còn đủ không */
      //chỉ có tác dụng demo khi dùng trực tiếp chắc chắn không dùng trường hợp này
      const dataBookToSave = [];
      for (const bookId of bookIds) {
        const bookData = await Book.findOne({
          bookId: bookId,
          quantityAvailable: { $gte: 1 },
        });
        if (!bookData) {
          return resolve({
            status: "ERR",
            message: `Không đủ số lượng sách ${bookId}`,
          });
        } else {
          bookData.quantityAvailable = bookData.quantityAvailable - 1;
          await bookData.save();
          const existingBookIndex = dataBookToSave.findIndex((item) =>
            item.bookId.equals(bookData._id)
          );
          if (existingBookIndex !== -1) {
            dataBookToSave[existingBookIndex].quantity++;
          } else {
            dataBookToSave.push({
              bookId: bookData._id,
              quantity: 1,
            });
          }
        }
      }

      const createdBorrowerSlip = new OffBorrowerSlip({
        books: dataBookToSave,
        name: name,
        phoneNumber: phoneNumber,
        totalAmount: totalAmount,
      });

      await createdBorrowerSlip.save();

      if (createdBorrowerSlip) {
        resolve({
          status: "OK",
          message: "success",
          data: createdBorrowerSlip,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOffSlip = (phoneNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bSlip = await OffBorrowerSlip.find({
        phoneNumber: phoneNumber,
      })
        .sort({
          createdAt: -1,
          updatedAt: -1,
        })
        .populate({
          path: "books.bookId",
          select: "name coverImg",
        });
      if (bSlip === null) {
        return resolve({
          status: "ERR",
          message: "The borrower slip is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: bSlip,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailOffSlip = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bSlip = await OffBorrowerSlip.findById(id).populate({
        path: "books.bookId",
        select: "name coverImg author category",
      });
      if (bSlip === null) {
        return resolve({
          status: "ERR",
          message: "The borrower slip is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESSS",
        data: bSlip,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allBSlip = await OffBorrowerSlip.aggregate([
        {
          $addFields: {
            statusOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ["$state", 3] }, then: 1 },
                  { case: { $eq: ["$state", 1] }, then: 2 },
                  { case: { $eq: ["$state", 2] }, then: 3 },
                ],
                default: 4, // Any other states, if needed
              },
            },
          },
        },
        {
          $sort: {
            statusOrder: 1, // Sắp xếp theo statusOrder (3 -> 1 -> 2)
            createdAt: -1,
          },
        },
      ]);

      if (!allBSlip) {
        return resolve({
          status: "ERR",
          message: "No borrower slips found",
        });
      }

      const statusStats = await OffBorrowerSlip.aggregate([
        {
          $group: {
            _id: "$state",
            count: { $sum: 1 },
          },
        },
      ]);

      const stat = [
        { name: 'chờ xác nhận', value: 0 },
        { name: 'đang mượn', value: 0 },
        { name: 'đã trả', value: 0 },
        { name: 'quá hạn', value: 0 },
      ];

      statusStats.forEach((statItem) => {
        switch (statItem._id) {
          case 0:
            stat[0].value = statItem.count;
            break;
          case 1:
            stat[1].value = statItem.count;
            break;
          case 2:
            stat[2].value = statItem.count;
            break;
          case 3:
            stat[3].value = statItem.count;
            break;
          default:
            break;
        }
      });

      resolve({
        status: "OK",
        message: "Success",
        data: allBSlip,
        stat: stat,
      });
    } catch (e) {
      reject(e);
    }
  });
};


const deleteMany = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await OffBorrowerSlip.deleteMany({ _id: ids });
      return resolve({
        status: "OK",
        message: "Delete borrower slip success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteOffSlip = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkBSlip = await OffBorrowerSlip.findOne({
        _id: id,
      });
      if (checkBSlip === null) {
        return resolve({
          status: "ERR",
          message: "The borrower slip is not define",
        });
      }

      await OffBorrowerSlip.findByIdAndDelete(id, { new: true });
      resolve({
        status: "OK",
        message: "Delete borrower slip success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateState = (id, newState, lateFee, paidLateFee) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bSlip = await OffBorrowerSlip.findById(id);
      if (!bSlip) {
        resolve({
          status: "ERR",
          message: "borrower slip is not define",
        });
      }
      const listBook = bSlip.books;
      const currentState = bSlip.state;

      const validTransitions = {
        1: [2, 3], // BORROWING (1) -> RETURNED (2) hoặc OVERDUE (3)
        2: [2], // RETURNED (2) 
        3: [2], // OVERDUE (3) -> RETURNED (2)
      };

      //1 mượn 2 trả 3 quá hạn
      if (!validTransitions[currentState]?.includes(newState)) {
        return resolve({
          status: "ERR",
          message: `Cannot transition state from ${currentState} to ${newState}`,
          data: currentState,
        });
      }

      if (newState === 3) {
        const checkPhone = BlockedPhone.findOne({
          phoneNumber: bSlip.phoneNumber
        })
        if (!checkPhone) {
          const blockPhone = new BlockedPhone({ phoneNumber: bSlip.phoneNumber })
          await blockPhone.save()
        }
      } else if (newState === 2) {
        const check = await ViolationCheck.check(bSlip.phoneNumber)
        if (currentState === 2) {
          if (check.lateOffBrSlip === 0 && check.lateBrSlip === 0 && paidLateFee === true) {
            await BlockedPhone.findOneAndDelete({
              phoneNumber: bSlip.phoneNumber
            },
              {
                new: true
              })
          }
          bSlip.lateFee = lateFee
          bSlip.paidLateFee = paidLateFee
          await bSlip.save()
          return resolve({
            status: "OK",
            message: "update complete",
            data: bSlip,
          })
        }
        if (currentState === 3) {
          if (check.lateOffBrSlip === 1 && check.lateBrSlip === 0 && paidLateFee === true) {
            await BlockedPhone.findOneAndDelete({
              phoneNumber: bSlip.phoneNumber
            },
              {
                new: true
              })
          }

          bSlip.lateFee = lateFee
          bSlip.paidLateFee = paidLateFee
        }
        const promises = listBook.map(async (book) => {
          const bookData = await Book.findOneAndUpdate(
            {
              _id: book.bookId,
            },
            {
              $inc: {
                quantityAvailable: +book.quantity,
              },
            },
            { new: true }
          );
          if (!bookData) {
            return {
              status: "ERR",
              message: `sách có id ${book.bookId} không còn tồn tại`,
            };
          } else {
            return {
              status: "OK",
              id: book.bookId,
            };
          }
        });
        await Promise.all(promises);
        bSlip.returnDate = new Date();
      }

      bSlip.state = newState;
      await bSlip.save();
      if (bSlip.state !== newState) {
        return resolve({
          status: "ERR",
          message: "Failed to update status",
        });
      }
      resolve({
        status: "OK",
        message: "update complete",
        data: bSlip,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: e.message,
      });
    }
  });
};

const callSlipStatistic = (year) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tạo mảng để lưu tổng số phiếu theo tháng
      const monthlySlipStats = [];
      const monthlyPenalty = [];

      // Tạo biến tổng số phiếu và tổng số sách được mượn
      let totalBorrowerSlip = 0;
      let totalBorrowedBook = 0;
      let totalLateFee = 0;
      let totalPaidLateFee = 0;

      for (let month = 1; month <= 12; month++) {
        // Xử lý điều kiện date trước khi thống kê từng tháng
        let dateCondition;

        if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
          dateCondition = [new Date(`${year}-${month}-01`), new Date(`${year}-${month}-31`)];
        } else if ([4, 6, 9, 11].includes(month)) {
          dateCondition = [new Date(`${year}-${month}-01`), new Date(`${year}-${month}-30`)];
        } else if (month === 2) {
          if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
            dateCondition = [new Date(`${year}-02-01`), new Date(`${year}-02-29`)];
          } else {
            dateCondition = [new Date(`${year}-02-01`), new Date(`${year}-02-28`)];
          }
        }

        const monthlyStats = await OffBorrowerSlip.aggregate([
          {
            $match: {
              createdAt: { $gte: dateCondition[0], $lte: dateCondition[1] }
            }
          },
          {
            $group: {
              _id: '$state',
              count: { $sum: 1 },
              totalBooks: { $sum: '$totalAmount' }
            }
          }
        ]);

        const penaltyStats = await OffBorrowerSlip.aggregate([
          {
            $match: {
              updatedAt: { $gte: dateCondition[0], $lte: dateCondition[1] },
              state: 2,
              lateFee: { $exists: true, $gt: 0 },
              paidLateFee: { $exists: true }
            }
          },
          {
            $group: {
              _id: '$paidLateFee',
              totalLateFee: { $sum: '$lateFee' }
            }
          }
        ]);

        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[month - 1];
        let paidLateFee = 0, unpaidLateFee = 0;

        let borrowing = 0, returned = 0, overdue = 0, monthlyBooks = 0;

        monthlyStats.forEach(stat => {
          if (stat._id === 1) borrowing = stat.count;
          if (stat._id === 2) returned = stat.count;
          if (stat._id === 3) overdue = stat.count;
          monthlyBooks += stat.totalBooks;
        });

        penaltyStats.forEach(stat => {
          if (stat._id) {
            paidLateFee = stat.totalLateFee;
            totalPaidLateFee += stat.totalLateFee;
          } else {
            unpaidLateFee = stat.totalLateFee;
          }
          totalLateFee += stat.totalLateFee;
        });

        totalBorrowerSlip += (borrowing + returned + overdue);
        totalBorrowedBook += monthlyBooks;

        monthlySlipStats.push({
          month: monthName,
          borrowing: borrowing,
          returned: returned,
          overdue: overdue
        });

        monthlyPenalty.push({
          month: monthName,
          paidLateFee: paidLateFee,
          unpaidLateFee: unpaidLateFee
        });
      }

      resolve({
        status: "OK",
        message: "complete statistic",
        data1: {
          totalBorrowerSlip: totalBorrowerSlip,
          totalBorrowedBook: totalBorrowedBook,
          monthlySlipStats: monthlySlipStats
        },
        data2: {
          totalLateFee: totalLateFee,
          totalPaidLateFee: totalPaidLateFee,
          monthlyPenalty: monthlyPenalty
        }
      });

    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  createBorrowerSlip,
  getAllOffSlip,
  getDetailOffSlip,
  getAll,
  deleteMany,
  deleteOffSlip,
  updateState,
  callSlipStatistic
};
