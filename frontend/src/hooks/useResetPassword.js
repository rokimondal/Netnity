import React from 'react'
import { resetPassword } from '../lib/api';
import { useMutation } from '@tanstack/react-query';

const useResetPassword = (options = {}) => {
    const { onSuccess, onError } = options;
    const { mutate, isPending, isError } = useMutation({
        mutationFn: resetPassword,
        onSuccess: (data) => {
            if (onSuccess) onSuccess(data);
        },
        onError: (err) => {
            if (onError) onError(err);
        }
    })
    return { resetPasswordMutation: mutate, resetPasswordLoading: isPending, resetPasswordError: isError }
}

export default useResetPassword