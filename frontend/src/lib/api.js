import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
    try {
        const response = await axiosInstance.post('/auth/signup', signupData)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const login = async (loginData) => {
    try {
        const response = await axiosInstance.post('/auth/login', loginData)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const logout = async () => {
    try {
        const response = await axiosInstance.post('/auth/logout')
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    } catch (error) {
        return null;
    }
}

export const sendOtp = async (sendCodeData) => {
    try {
        const response = await axiosInstance.post('/auth/send-otp', sendCodeData)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const verifyOtp = async (verifyCodeData) => {
    try {
        const response = await axiosInstance.post('/auth/verify-code', verifyCodeData)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const resetPassword = async (resetData) => {
    try {
        const response = await axiosInstance.post('/auth/reset-password', resetData)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const completeOnboarding = async (userData) => {
    try {
        const response = await axiosInstance.post('/auth/onboard', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getSecret = async () => {
    try {
        const response = await axiosInstance.get('/uploads/get-upload-secret',);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateUploadImage = async (imageData) => {
    try {
        const response = await axiosInstance.post('/uploads/store-temp-image', imageData);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getUserFriends = async () => {
    try {
        const response = await axiosInstance.get('/users/friends');
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getRecommendedUsers = async () => {
    try {
        const response = await axiosInstance.get('/users/');
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getOutgoingFriendReqs = async () => {
    try {
        const response = await axiosInstance.get('/users/outgoing-friend-requests');
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const sendFriendRequest = async (id) => {
    try {
        const response = await axiosInstance.post(`/users/friend-request/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getFriendRequest = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/friend-requests`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const acceptFriendRequest = async (id) => {
    try {
        const response = await axiosInstance.put(`/users/friend-request/${id}/accept`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getStreamToken = async () => {
    try {
        const response = await axiosInstance.get("/chat/token");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateProfile = async (userData) => {
    try {
        const response = await axiosInstance.put('/users/update-profile', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}