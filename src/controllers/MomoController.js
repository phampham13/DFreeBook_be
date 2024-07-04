const axios = require('axios');
const crypto = require('crypto');
const momoConfig = require('../config/momo');
const OrderService = require('../services/OrderService');
const BorrowerSlipService = require('../services/BorrowerSlipService');

const createPayment = async (req, res) => {
    const { orderId, amount, ipn } = req.body;
    console.log("req body", req.body)
    //const requestId = `${orderId}_${Date.now()}`;
    //const orderInfo = `Thanh toán đơn hàng ${orderId}`;
    //const redirectUrl = 'http://localhost:5173/'; //url điều hướng đến khi thanh toán thành công
    let {
        accessKey,
        secretKey,
        orderInfo,
        partnerCode,
        redirectUrl,
        ipnBase,
        //ipnUrl,
        requestType,
        extraData,
        orderGroupId,
        autoCapture,
        lang,
    } = momoConfig

    var ipnUrl = ipnBase + ipn
    //console.log("call", ipnUrl)

    var requestId = orderId;

    var rawSignature =
        'accessKey=' +
        accessKey +
        '&amount=' +
        amount +
        '&extraData=' +
        extraData +
        '&ipnUrl=' +
        ipnUrl +
        '&orderId=' +
        orderId +
        '&orderInfo=' +
        orderInfo +
        '&partnerCode=' +
        partnerCode +
        '&redirectUrl=' +
        redirectUrl +
        '&requestId=' +
        requestId +
        '&requestType=' +
        requestType;

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: 'Test',
        storeId: 'MomoTestStore',
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        userInfo: {
            name: "pham pham"
        },
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
    });

    let result;

    try {
        result = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        //console.log(result)
        const { payUrl } = result.data;

        res.json({ payUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
};

const handlePayPenalty = async (req, res) => {
    /**
      resultCode = 0: giao dịch thành công.
      resultCode = 9000: giao dịch được cấp quyền (authorization) thành công .
      resultCode <> 0: giao dịch thất bại.
     */
    console.log(req.body);
    const { orderId, resultCode } = req.body;
    console.log("eeee", orderId)
    try {
        if (resultCode === 0) {
            console.log("vô đây chưa")
            await BorrowerSlipService.payFeeSuccess(orderId) //thực chất là slipId đầu tiên trong mảng phiếu bị phạt
            res.status(200).json({ status: "OK", message: 'IPN received' });
        }
        else {
            res.status(200).json({ message: 'IPN received' })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thanh toán phí phạt!' });
    }
    //const result = req.body.resultCode
    //if(result !== 0){
    //    return res.status(500).json({ error: 'Giao dịch thất bại!' })
    //} else {
    //    const lg = 
    //}
    /**
     * Dựa vào kết quả này để update trạng thái đơn hàng
     * Kết quả log:
     * {
          partnerCode: 'MOMO',
          orderId: 'MOMO1712108682648',
          requestId: 'MOMO1712108682648',
          amount: 10000,
          orderInfo: 'pay with MoMo',
          orderType: 'momo_wallet',
          transId: 4014083433,
          resultCode: 0,
          message: 'Thành công.',
          payType: 'qr',
          responseTime: 1712108811069,
          extraData: '',
          signature: '10398fbe70cd3052f443da99f7c4befbf49ab0d0c6cd7dc14efffd6e09a526c0'
        }
     */


    //return res.status(204).json(req.body);
};

const handlePayOrder = async (req, res) => {
    console.log(req.body);
    const { orderId, resultCode, transId } = req.body;
    try {
        if (resultCode === 0) {
            const response = await OrderService.payOrderSuccess(orderId, transId)
            res.status(200).json(response);
        }
        else {
            res.status(200).json({ message: 'chưa thanh toán' })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi thanh toán phí phạt!' });
    }
};

const transactionCheck = async (req, res) => {
    const { orderId } = req.body;

    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    var secretKey = momoConfig.secretKey;
    var accessKey = momoConfig.accessKey;
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: 'MOMO',
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: 'vi',
    });

    const result = await axios.post('https://test-payment.momo.vn/v2/gateway/api/query', requestBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    })

    return res.status(200).json(result.data);
};

const refund = async (req, res) => {
    const { transId, amount } = req.body; //requestId
    let {
        accessKey,
        secretKey,
        orderInfo,
        partnerCode,
        redirectUrl,
        ipnBase,
        requestType,
        extraData,
        orderGroupId,
        autoCapture,
        lang,
    } = momoConfig
    var orderId = partnerCode + new Date().getTime() + "1";
    var requestId = orderId
    const description = "Hủy đơn hàng"

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}&transId=${transId}`
    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: 'MOMO',
        requestId: requestId,
        orderId: orderId,
        amount: amount,
        transId: transId,
        lang: 'vi',
        description: description,
        signature: signature
    });

    try {
        const result = await axios.post('https://test-payment.momo.vn/v2/gateway/api/refund', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return res.status(200).json(result.data)
    } catch (error) {
        //console.error(error);
        return res.status(500).json({ error: 'Something went wrong!' });
    }


}

module.exports = {
    createPayment,
    handlePayPenalty,
    handlePayOrder,
    transactionCheck,
    refund
}