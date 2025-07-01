import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { signup } from '../lib/api'

const useSignUp = (options = {}) => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
        },
        onError: (error) => {
            if (options.onError) options.onError(error);

        },
    })
    return { signupMutation: mutate, isPending, error };
}

export default useSignUp