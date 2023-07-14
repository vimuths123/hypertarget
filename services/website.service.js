import axios from "axios"
import Router from "next/router";

export const websiteService = {
    getWebsiteByUser,
    getAllWebsiteByUser,
};

const requestObj = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
    'Origin,Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'GET, POST,PUT,DELETE, OPTIONS',
    
}

async function getWebsiteByUser(session,webisteId) {
    if(session && session.accessToken){
        try {
        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + 'website/getWebsiteByUserId/'+webisteId;

        const response = await axios.get(url, config);

        if (response.status === 200 && response.data.website) {
            return { status: 200, website: response.data.website }
        } else {
            return { status: response.status, error: response.data.message }
        }
    } catch (error) {
        return { status: 500, error: error }
    }}
    else{
        return { status: 400, error: "session need for response." }
    }
}

async function getAllWebsiteByUser(session) {
    if(session && session.accessToken){
        try {
        const config = {
            headers: {
                ...requestObj,
                "Authorization": session.accessToken
            }
        }

        const url = process.env.BASE_URL + 'website/getWebsiteByUserId';

        const response = await axios.get(url, config);
        if (response.status === 200) {
            return { status: 200, websites: response.data.websites }
        } else {
            return { status: response.status, error: response.data.message }
        }
    } catch (error) {
        return { status: 500, error: error }
    }}
    else{
        return { status: 400, error: "session need for response." }
    }
}