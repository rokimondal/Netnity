import React from 'react'
import { verifyOtp } from '../lib/api';
import { useMutation } from '@tanstack/react-query';

const useVerifyCode = (options = {}) => {
    const { onSuccess, onError } = options;
    const { mutate, isPending, isError } = useMutation({
        mutationFn: verifyOtp,
        onSuccess: (data) => {
            if (onSuccess) onSuccess(data);
        },
        onError: (err) => {
            if (onError) onError(err);
        }
    })
    return { verifyCodeMutation: mutate, verifyCodeLoading: isPending, verifyCodeError: isError }
}

export default useVerifyCode