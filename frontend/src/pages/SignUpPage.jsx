import { useState } from 'react'
import VideoCallIcon from '../components/VideoCallIcon'
import { Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import OtpInput from '../components/OtpInput';
import useSignUp from '../hooks/useSignUp';
import useSendOtp from '../hooks/useSendOtp';

const STEP = {
    FILL: "fill",
    VERIFY: "verify"
};

function SignUpPage() {
    const [step, setStep] = useState(STEP.FILL);
    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [code, setCode] = useState("")
    const [formError, setFormError] = useState("");
    const [otpErrorMsg, setOtpErrorMsg] = useState("");

    const { signupMutation, isPending } = useSignUp({
        onError: (error) => {
            const msg = error?.response?.data?.message || '';
            if (msg === "Invalid or expired OTP") {
                setOtpErrorMsg(msg)
                setStep('verify');
            } else {
                setFormError(msg)
                setStep('fill');
            }
        }

    });
    const { otpMutation, otpLoading } = useSendOtp({
        onSuccess: () => {
            setStep(STEP.VERIFY);
        },
        onError: (error) => {
            const message = error?.response?.data?.message || "";
            setFormError(message)

        }
    })


    const handlesendCode = () => {
        if (!signupData.email) {
            setFormError("Email is required");
            return;
        }
        if (!signupData.fullName || !signupData.password) {
            setFormError("Please fill out all fields");
            return;
        }
        if (signupData.password.length < 6) {
            setFormError("Password must be at least 6 characters");
            return;
        }

        setCode("");
        const sendCodeData = {
            email: signupData.email,
            purpose: "signup"
        }
        otpMutation(sendCodeData);
    }


    const handleSignup = () => {
        if (code.length !== 6) {
            setOtpErrorMsg("OTP must be 6 digits");
            return;
        }
        signupMutation({ ...signupData, otp: code });
    }


    const handleChangeOtp = (newOtp) => {
        setCode(newOtp);
    }


    return (
        <div>
            {step == STEP.FILL ? <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 border-white">
                <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-md shadow-lg overflow-hidden'>
                    {/* left side */}
                    <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
                        <div className="mb-4 flex items-center justify-start gap-2">
                            <Languages className="size-9 text-primary" />
                            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                                Netnity
                            </span>
                        </div>
                        {formError && (<div className='alert alert-error mb-4 rounded-md'>
                            <span>{formError}</span>
                        </div>)}
                        <div className='w-full'>
                            <form onSubmit={(e) => { e.preventDefault(); handlesendCode(); }}>
                                <div className='space-y-4'>
                                    <div>
                                        <h2 className='text-xl font-semibold'>Create an Account</h2>
                                        <p className="text-sm opacity-70">
                                            Join Netnity and start your language learning adventure!
                                        </p>
                                    </div>
                                    <div className='space-y-3'>
                                        <div className='form-control w-full'>
                                            <label className='label'>Full Name</label>
                                            <input
                                                type='text'
                                                placeholder='John Doe'
                                                className='input input-bordered w-full placeholder-base-content/50 rounded-md outline-none focus:outline-none'
                                                value={signupData.fullName}
                                                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div className='form-control w-full'>
                                            <label className='label'>Email</label>
                                            <input
                                                type='email'
                                                placeholder='john@gmail.com'
                                                className='input input-bordered w-full placeholder-base-content/50 rounded-md outline-none focus:outline-none'
                                                value={signupData.email}
                                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className='form-control w-full'>
                                            <label className='label'>Password</label>
                                            <input
                                                type='password'
                                                placeholder='******'
                                                className='input placeholder-base-content/50 input-bordered w-full rounded-md outline-none focus:outline-none'
                                                value={signupData.password}
                                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                            />
                                            <p className="text-xs opacity-70 mt-1">
                                                Password must be at least 6 characters long
                                            </p>
                                        </div>
                                        <div className="form-control">
                                            <label className="label cursor-pointer justify-start gap-2">
                                                <input type="checkbox" className="checkbox checkbox-sm rounded-md" required />
                                                <span className="text-xs leading-tight">
                                                    I agree to the{" "}
                                                    <span className="text-primary hover:underline">terms of service</span> and{" "}
                                                    <span className="text-primary hover:underline">privacy policy</span>
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <button type='submit' className='btn btn-primary w-full rounded-md mt-4' disabled={otpLoading}>
                                    {otpLoading ? (<span className="loading loading-dots loading-xl"></span>) : "Send code"}
                                </button>
                                <div className='text-center mt-1 flex flex-row items-center justify-center'>
                                    <p className='textarea-sm'>
                                        Already have an account?{" "}
                                        <Link to="/login" className='text-primary hover:underline'>Sign in</Link>
                                    </p>
                                </div>
                            </form>
                        </div>

                    </div>
                    {/* right side */}
                    <div className='hidden lg:flex items-center justify-center lg:w-1/2 bg-primary/10'>
                        <div className='max-w-md p-8'>
                            <div className="relative aspect-square max-w-sm mx-auto">
                                <VideoCallIcon className="w-full h-full" />
                            </div>
                            <div className="text-center space-y-3 mt-6">
                                <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
                                <p className="opacity-70">
                                    Practice conversations, make friends, and improve your language skills together
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <div className='h-screen flex flex-col items-center justify-center '>
                <div className='space-y-3 flex flex-col items-center justify-center'>
                    <h2 className='text-3xl lg:text-5xl font-bold'>Verify Your Email</h2>
                    <p className='max-w-96 text-xs md:text-sm lg:text-base md:max-w-xl lg:max-w-3xl text-center opacity-50 '>{`We've sent a 6-digit verification code to ${signupData.email}. Please enter the code below to complete the verification process.`}</p>
                </div>
                <div className='mt-4 flex flex-col items-center justify-center'>
                    <OtpInput length={6} handleChangeOtp={handleChangeOtp} />
                    {otpErrorMsg && <div className="mt-2 text-sm text-red-500 font-medium">
                        {otpErrorMsg}
                    </div>}
                    <button onClick={handleSignup} type='submit' className='btn btn-primary w-full rounded-md mt-3 max-w-36 lg:max-w-56 lg:text' disabled={isPending}>{isPending ? (<span className="loading loading-dots loading-xl"></span>) : "Sign Up"}</button>
                </div>
                <p className='text-xs mt-6 lg:mt-7 lg:text-sm '>
                    <span>Want to change your Email Address?</span>{" "}
                    <span className='hover:cursor-pointer hover:underline hover:text-primary/90 font-bold' onClick={() => setStep(STEP.FILL)}>Change here</span>
                </p>
                <p className='text-xs mt-2 lg:text-sm hover:cursor-pointer hover:underline hover:text-primary/90 font-bold' onClick={handlesendCode}>Resend code</p>
            </div>}
        </div>
    )
}

export default SignUpPage