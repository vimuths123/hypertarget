import axios from "axios"

const requestObj = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
    "Origin,Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST,PUT,DELETE, OPTIONS",
    
}

export const paymentService = {
    createPayment,
    isSubscribed,
    getCardData,
    getPayHistory,
    updateCard,
};

async function createPayment(session, body) {
    try {
        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + '/payment/createPayment';
        const response = await axios.post(url, body, config);
        //console.log("RES ", response)
        if (response.data.message=='success!') {
            return { status: response.status, message: response.data.message };
        } else {
            return { status: response.status, message: "An error occured" };
        }
    } catch (error) {
        if(error.response && error.response.status){
            return { status: error.response.status, message: error.response.data.message };
        }
        return { status: 500, message: error.message.code };
    }
}

async function isSubscribed(session) {
    try {
        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + '/payment/isSubscribed';
        const response = await axios.post(url, {email:session.user.email}, config);
        //console.log("RES ", response)
        if (response.status==200) {
            return { status: response.status, isSubscribed: response.data.isSubscribed };
        } else {
            return { status: response.status, message: "An error occured" };
        }
    } catch (error) {
        if(error.response && error.response.status){
            return { status: error.response.status, message: error.response.data.message };
        }
        return { status: 500, message: error.message.code,isSubscribed:false };
    }
}

async function getCardData(session) {
    try {
        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + '/payment/getCardInfo';
        const response = await axios.get(url, config);
        //console.log("RES ", response)
        if (response.status==200) {
            return { status: response.status, customerInfo: response.data.customerInfo, cardInfo: response.data.cardInfo};
        } else {
            return { status: response.status, message: "An error occured" };
        }
    } catch (error) {
        if(error.response && error.response.status){
            return { status: error.response.status, message: error.response.data.message };
        }
        return { status: 500, message: error.message.code };
    }
}


async function getPayHistory(session) {
    try {
        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + '/payment/getAllPayments';
        const response = await axios.get(url, config);
        //console.log("RES ", response)
        if (response.status==200) {
            return { status: response.status, allPayments: response.data.allPayments.data };
        } else {
            return { status: response.status, message: "An error occured" };
        }
    } catch (error) {
        if(error.response && error.response.status){
            return { status: error.response.status, message: error.response.data.message };
        }
        return { status: 500, message: error.message.code,isSubscribed:false };
    }
}

async function updateCard(session,body) {
    try {
        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + '/payment/updateCard';
        const response = await axios.put(url,body, config);
        //console.log("RES ", response)
        if (response.status==200) {
            return { status: response.status, message: "success!" };
        } else {
            return { status: response.status, message: "An error occured" };
        }
    } catch (error) {
        console.log(error)
        if(error.response && error.response.status){
            return { status: error.response.status, message: error.response.data.message };
        }
        return { status: 500, message: error.message.code };
    }
}