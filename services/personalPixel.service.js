//
import axios from "axios"
import Router from "next/router";


const requestObj = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
    'Origin,Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST,PUT,DELETE, OPTIONS',
     
}


async function getPixel(session,webisteId) {
    try {
        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + 'website/generatePixelId/'+webisteId;
        //console.log("**2")
        const res = await axios.get(url,config);
        console.log("test :",res.data)

        if (res.status === 200) {
            return res.data;
        } else {
            console.log("Error ", res.data.message)
            return { error: true, message: res.data.message }
        }
    } catch (error) {
       // console.log("error :",err)
        const message = (error.response && error.response.data && error.response.data.message) || "An error occured"
        return ({ error: true, message: message })
    }

}

async function verifyPixel(session, websiteId) {
    try {

        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + 'website/verifyPixel';
        const res = await axios.post(url, { websiteId: websiteId }, config);

        if (res.status === 200) {
            //console.log("pixel :",res.data)
            return res.data;
            
        } else {
            return { error: true, message: res.data.message,verified:false }
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || "An error occured"
        return ({ error: true, message: message,verified:false })
    }
}

async function addDomain(session, domain) {
    try {

        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + 'website/addDomain';
        const res = await axios.post(url, { domain: domain }, config);

        if (res.status === 200) {
            return {error:false,message:res.data.message,websiteId:res.data.websiteId};
            
        } else {
            return { error: true, message: res.data.message }
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || "An error occured"
        return ({ error: true, message: message })
    }
}

export const personalPixelService = {
    getPixel,
    verifyPixel,
    addDomain
};