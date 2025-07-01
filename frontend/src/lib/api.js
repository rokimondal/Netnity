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

export const logout = async (loginData) => {
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