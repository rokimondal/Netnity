import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '../lib/upload';

const useUploadImage = (options = {}) => {
    const { onSuccess, onError } = options;
    const { mutate, isPending, isError } = useMutation({
        mutationFn: uploadImage,
        onSuccess: (data) => {
            if (onSuccess) onSuccess(data);
        },
        onError: (error) => {
            if (onError) onError(error);
        }
    })
    return { uploadingImage: mutate, uploading: isPending, isError };
}

export default useUploadImage