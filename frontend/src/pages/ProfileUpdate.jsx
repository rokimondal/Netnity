import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../lib/api';
import ImageUploader from '../components/ImageUploader';
import { Camera, MapPinIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';

const ProfileUpdate = () => {
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();


    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        nativeLanguage: authUser?.nativeLanguage || "",
        learningLanguage: authUser?.learningLanguage || "",
        location: authUser?.location || "",
        profilePic: authUser?.profilePic || ""
    })

    const { mutate: updateProfileData, isPending } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.response.data.message);
        }
    })

    const [isImageUploaderOpen, setImageUploader] = useState(false);

    const updateImage = (url) => {
        setFormState({ ...formState, profilePic: url });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfileData(formState);
    }

    const handleRandomAvatar = () => {
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        setFormState({ ...formState, profilePic: randomAvatar });
    }

    return (
        <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
            {isImageUploaderOpen && <ImageUploader onClose={() => setImageUploader(false)} uploadprofile={updateImage} />}
            <div className='card bg-base-100 w-full max-w-3xl'>
                <div className='card-body p-6 sm:p-8'>
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Update Your Profile</h1>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* PROFILE PIC CONTAINER */}
                        <div className='flex flex-col items-center justify-center space-y-4'>
                            {/* IMAGE PREVIEW */}
                            <div>

                                <div className='size-32 bg-base-300 rounded-full overflow-hidden'>
                                    {formState.profilePic ? (<img src={formState.profilePic} alt='Profile Preview'
                                        className='w-full h-full object-cover'
                                    />) : (<div className='flex items-center justify-center h-full'>
                                        <Camera className='size-12 text-base-content opacity-40' />
                                    </div>)}
                                    <button
                                        type='button'
                                        className=' relative bottom-9 flex items-center justify-center  min-h-10 w-10 min-w-32 cursor-pointer bg-transparent hover:bg-neutral transition-all duration-500 border-none'
                                        onClick={() => setImageUploader(true)}>
                                        <Camera className='size-5 text-white' />

                                    </button>
                                </div>
                            </div>

                            {/* Generate Random Avatar BTN */}
                            <div className='flex items-center gap-2'>
                                <button type='button' onClick={handleRandomAvatar} className="btn btn-accent text hover:cursor-pointer">
                                    <ShuffleIcon className='size-4 mr-2' />
                                    Generate Random Avatar
                                </button>
                            </div>
                        </div>

                        {/* FULL NAME */}
                        <div className='form-control '>
                            <label className='label'>
                                <span className='label-text'>Full Name</span>
                            </label>
                            <input
                                type='text'
                                name='fullName'
                                value={formState.fullName}
                                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                                className='input input-bordered w-full rounded-md focus:outline-none'
                                placeholder='Your full name'
                            />
                        </div>

                        {/* BIO */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Bio</span>
                            </label>
                            <textarea
                                name="bio"
                                value={formState.bio}
                                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                className="textarea textarea-bordered h-24 rounded-md max-h-32 focus:outline-none"
                                placeholder="Tell others about yourself and your language learning goals"
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Native Language</span>
                                </label>
                                <select
                                    name='nativeLanguage'
                                    value={formState.nativeLanguage}
                                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                                    className='select select-bordered w-full rounded-md focus:outline-none'
                                >
                                    <option value="">Select your native language</option>
                                    {LANGUAGES.map((lang) => (<option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>))}
                                </select>
                            </div>
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text text-base'>Learning Language</span>
                                </label>
                                <select
                                    name='learningLanguage'
                                    value={formState.learningLanguage}
                                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                                    className='select select-bordered w-full rounded-md focus:outline-none'
                                >
                                    <option value="">Select your learning language</option>
                                    {LANGUAGES.map((lang) => (<option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>))}
                                </select>
                            </div>
                        </div>

                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text-alt'>Location</span>
                            </label>
                            <div className='relative'>
                                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                                <input
                                    type='text'
                                    name='location'
                                    value={formState.location}
                                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                                    className='input input-bordered pl-10 w-full rounded-md border focus:outline-none'
                                    placeholder='City, Country'
                                />
                            </div>
                        </div>

                        <button type='submit' className='btn w-full btn-primary' disabled={isPending}>{isPending ? <span className="loading loading-dots loading-xl"></span> : "Update Profile"
                        }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileUpdate