import axios from "axios"

const requestObj = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
    "Origin,Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST,PUT,DELETE, OPTIONS",
    
}

export const notificationService = {
    updateNotification,
};

async function updateNotification(session, body) {
    try {
        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + '/notification/notificationUpdate';
        const response = await axios.put(url, body, config);
        if (response.status==200) {
            return { status: response.status, message: response.data.message,user:response.data.user };
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
