import { BASE_URL, commonAPI } from "./commonAPI"


export const userRegisterAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/register`,data,"")
}

export const userLoginAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/login`,data,"")
}

export const verifyUserAPI = async(reqHeader)=>{
    return await commonAPI('POST',`${BASE_URL}/verify`,{},reqHeader)
}

export const addToFriendsAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/add-friend`,data,"")
}

export const getFriendsDetailsAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/getFriendDetails`,data,"")
}

export const getChatAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/getChat`,data,"")
}

export const getUserDetailsAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/getuser`,data,"")
}

export const updateUserDetailsAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/updateUser`,data,"")
}

export const removeFriendsAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/removeFriends`,data,"")
}

export const reportBugAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/bug`,data,"")
}

export const getBugAPI = async()=>{
    return await commonAPI('GET',`${BASE_URL}/getBug`,{},"")
}

export const removeBugAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/removeBug`,data,"")
}

export const reportUserAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/spam`,data,"")
}

export const getUserReportAPI = async()=>{
    return await commonAPI('GET',`${BASE_URL}/getUserReport`,{},"")
}

export const newEmailAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/newEmail`,data,"")
}

export const getEmailAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/getEmail`,data,"")
}

export const removeEmailAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/deleteEmail`,data,"")
}

export const banUserAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/banUser`,data,"")
}

export const isUserBannedAPI = async(data)=>{
    return await commonAPI('POST',`${BASE_URL}/isbanned`,data,"")
}