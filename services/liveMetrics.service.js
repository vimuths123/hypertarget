import axios from "axios"

const requestObj = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
    "Origin,Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST,PUT,DELETE, OPTIONS",
    
}

export const liveMetricsService = {
    getLiveMetrics,
};

async function getLiveMetrics(session, body,websiteId) {
    try {
        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + 'liveMetricsWithSource/' + websiteId;
        const response = await axios.post(url, body, config);
        //console.log("RES ", response)
        if (response.status==200) {
            return { status: response.status, result: response.data.userJourney};
        } else {
            return { status: response.status, message: "An error occured" };
        }
    } catch (error) {
        return { status: 500, message: error.message.code };
    }
}
