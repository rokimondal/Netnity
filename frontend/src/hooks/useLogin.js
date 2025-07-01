import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../lib/api'

const useLogin = (options = {}) => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
        },
        onError: (error) => {
            if (options.onError) options.onError(error);

        },
    })
    return { loginMutation: mutate, isPending, error };
}

export default useLogin