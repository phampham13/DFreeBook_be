const nodemailer = require('nodemailer')
import { env } from '~/config/environment';
//var inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailCreateOrder = async (email, orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: env.MAIL_ACCOUNT, // generated ethereal user
      pass: env.MAIL_PASSWORD, // generated ethereal password
    },
  });

  let listItem = '';
  orderItems.forEach((product) => {
    listItem += `<div>
    <div>
      Bạn đã đặt sản phẩm <b>${product.productId.name}</b> có là: <b>${product.productId.price} VND</b> với số lượng: <b>${product.quantity}</b></div>
      <div>Hình ảnh của sản phẩm</div>
      <img src=${product.productId.image} alt=${product.productId.name} width="100" height="100">
    </div>`
    // attachImage.push({path: order.image})
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: env.MAIL_ACCOUNT, // sender address
    to: "bigbossngan@gmail.com", // list of receivers
    subject: "Bạn đã đặt hàng tại DFreeBook", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công</b></div> ${listItem}`, //
    //attachments: attachImage,
  });
}

const sendEmailCreateSlipBorrower = async (email, books, dueDate) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: env.MAIL_ACCOUNT, // generated ethereal user
      pass: env.MAIL_PASSWORD, // generated ethereal password
    },
  });

  let year = dueDate.getFullYear()
  let month = dueDate.getMonth() + 1
  let date = dueDate.getDate()
  let listBook = '';
  books.forEach((book) => {
    listBook += `<div>
    <div>
      Bạn đã đặt mượn sách <b>${book.bookId.name}</b> với số lượng: <b>${book.quantity} quyển</b></div>
      <div>Bìa sách
      <img  src=${book.bookId.coverImg} alt=${book.bookId.name} width="75" height="100">
      </div>
      <strong>Hạn trả: ${date}-${month}-${year}</strong>
    </div>`
  })

  let info = await transporter.sendMail({
    from: env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Bạn đã tạo phiếu mượn tại DFreeBook", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã tạo phiếu mượn thành công</b></div> ${listBook}`, //
    //attachments: attachImage,
  });
}

const sendReminderEmail = async (emails) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: env.MAIL_ACCOUNT,
      pass: env.MAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: env.MAIL_ACCOUNT,
    to: emails.join(','),
    subject: "Bạn có phiếu mượn quá hạn",
    text: "Hello world?",
    html: `<div>
    Bạn đọc có phiếu mượn quá hạn tại DFreebook. Bạn hãy kiểm tra và sớm trả lại sách cho bọn
    mình. Nếu không tài khoản của bạn sẽ bị khóa và sẽ tính phí phạt theo quy định của thư viện.
    </div>`,
  });
}

const sendResetLink = async (email, token) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: env.MAIL_ACCOUNT,
      pass: env.MAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: env.MAIL_ACCOUNT,
    to: email,
    subject: "Reset password Dfree",
    text: "Hello world?",
    html: `<div><b>Ấn vào liên kết sau để lấy lại mật khẩu</b></div> <a href="${env.CLIENT_PORT}/passwordReset?token=${token}"> Reset Password </a>`,
  });
}


module.exports = {
  sendEmailCreateOrder,
  sendEmailCreateSlipBorrower,
  sendReminderEmail,
  sendResetLink,
}