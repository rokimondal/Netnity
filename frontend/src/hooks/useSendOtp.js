import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { sendOtp } from '../lib/api'

const useSendOtp = (options = {}) => {
    const { onSuccess, onError } = options;
    const { mutate, isPending, isError } = useMutation({
        mutationFn: sendOtp,
        onSuccess: (data) => {
            if (onSuccess) onSuccess(data);
        },
        onError: (err) => {
            if (onError) onError(err);
        }
    })
    return { otpMutation: mutate, otpLoading: isPending, otpError: isError }
}

export default useSendOtp