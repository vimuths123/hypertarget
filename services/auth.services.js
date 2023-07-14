import axios from "axios"
import Router from "next/router";
import Cookies from 'js-cookie';

export const authService = {
    signUp,
    signOut,
    signIn,
    signUpGoogle,
    signUpFacebook,
    getUserData,
    signInFacebookAuth,
    signInGoogleAuth,
};

const requestObj = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
    "Origin,Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST,PUT,DELETE, OPTIONS",
    
}

async function signUp(userInfo) {
    try {
        const res = await axios.post(process.env.BASE_URL + 'auth/signUp', userInfo, requestObj);
        //console.log("RES ", res)
        if (res.status === 200 ) {
            return res;
        } else {
            console.log("Error ", res.data)
            return { error: true, message: res.data.message }
        }
    } catch (error) {
        console.log("On Catch ", error)
        const message = (error.response && error.response.data && error.response.data.message) || "An error occured"
        return ({ error: true, message: message })
    }
}

function signOut () {
    Cookies.remove('user');
    Cookies.remove('accessToken');
    const { asPath } = Router;
    console.log(asPath)
    if(asPath=="/"){
        console.log("asPath")
        window.location.reload();
    }else{
        Router.push("/")
    }
    
}
async function signIn(userInfo) {
    try {
        const res = await axios.post(process.env.BASE_URL + '/auth/signIn', userInfo, requestObj);
        if (res.status === 200 && res.data.user) {
            //localStorage.setItem('user', JSON.stringify(res.data.user))
            return res.data;
        } else {
            console.log("Error ", res.data)
            return { error: true, message: res.data.message }
        }
    } catch (error) {
        console.log("On Catch ", error)
        const message = (error.response && error.response.data && error.response.data.message) || "An error occured"
        return ({ error: true, message: message })
    }
}

async function signInFacebookAuth(userInfo) {
    try {
        const res = await axios.post(process.env.BASE_URL + '/auth/signInFacebook', userInfo, requestObj);
        if (res.status === 200 && res.data.user) {
            //localStorage.setItem('user', JSON.stringify(res.data.user))
            return res.data;
        } else {
            console.log("Error ", res.data)
            return { error: true, message: res.data.message }
        }
    } catch (error) {
        console.log("On Catch ", error)
        const message = (error.response && error.response.data && error.response.data.message) || "An error occured"
        return ({ error: true, message: message })
    }
}

async function signInGoogleAuth(userInfo) {
    try {
        //console.log("userInfo :",userInfo )
        const res = await axios.post(process.env.BASE_URL + '/auth/signInGoogle', userInfo, requestObj);
        if (res.status === 200 && res.data.user) {
            //localStorage.setItem('user', JSON.stringify(res.data.user))
            return res.data;
        } else {
            console.log("Error ", res.data)
            return { error: true, message: res.data.message }
        }
    } catch (error) {
        console.log("On Catch ", error)
        const message = (error.response && error.response.data && error.response.data.message) || "An error occured"
        return ({ error: true, message: message })
    }
}

async function signUpGoogle(userInfo) {
    try {
        const res = await axios.post(process.env.BASE_URL + 'auth/signUpGoogle', userInfo, requestObj);
        //console.log('axiosRes : ',res)
        if (res.status === 200 && res.data.user) {
            return ({ status: res.status, data: res.data,message: res.data.message });
        } else {
            console.log("Error ", res.data)
            return { status: res.status,error: true, message: res.data.message 
            }
        }
    } catch (error) {
        console.log("On Catch ", error)
        const message = (error.response && error.response.data && error.response.data.message) || "An error occured"
        return ({ status: 400,error: true, message: message })
    }
}


async function signUpFacebook(userInfo) {
    try {
        const res = await axios.post(process.env.BASE_URL + 'auth/signUpfacebook', userInfo, requestObj);
        //console.log('axiosRes : ',res)
        if (res.status === 200 && res.data.user) {
            return ({ status: res.status, data: res.data,message: res.data.message });
        } else {
            console.log("Error ", res.data)
            return { status: res.status,error: true, message: res.data.message 
            }
        }
    } catch (error) {
        console.log("On Catch ", error)
        const message = (error.response && error.response.data && error.response.data.message) || "An error occured"
        return ({ status: 400,error: true, message: message })
    }
}

async function getUserData(token) {

    const config = {
        headers: {
            ...requestObj,
            "Authorization": token
        }
    }
    try {
        const res = await axios.get(process.env.BASE_URL + '/auth/getUserDataByToken', config);
        //console.log('axiosRes : ',res)
        if (res.status === 200 && res.data.user) {
            return ({ status: res.status, data: res.data,error: false});
        } else {
            console.log("Error ", res.data)
            return { status: res.status,error: true, message: res.data.message 
            }
        }
    } catch (error) {
        console.log("On Catch ", error)
        const message = (error.response && error.response.data && error.response.data.message) || "An error occured"
        return ({ status: 400,error: true, message: message })
    }
}