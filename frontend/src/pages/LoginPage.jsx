import { useState } from 'react'
import VideoCallIcon from '../components/VideoCallIcon'
import { Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import OtpInput from '../components/OtpInput';
import useLogin from '../hooks/useLogin';
import useSendOtp from '../hooks/useSendOtp';


const STEP = {
  FILL: "fill",
  VERIFY: "verify"
};

const LOGIN_TYPE = {
  PASSWORD: "password",
  OTP: "otp"
};
function LoginPage() {
  const [step, setStep] = useState(STEP.FILL);
  const [type, setType] = useState(LOGIN_TYPE.PASSWORD);//"password" "otp"
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [code, setCode] = useState("")
  const [formError, setFormError] = useState("");
  const [otpErrorMsg, setOtpErrorMsg] = useState("");

  const { loginMutation, isPending } = useLogin({
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
      setStep("verify");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "";
      setFormError(message)

    }
  })


  const handlesendCode = () => {
    if (!loginData.email) {
      setFormError("Email is required");
      return;
    }
    setCode("");
    const sendCodeData = {
      email: loginData.email,
      purpose: "login"
    }
    otpMutation(sendCodeData);
  }


  const handleLogin = () => {
    if (!loginData.email) {
      setFormError("Email is required");
      return;
    }
    if (type === LOGIN_TYPE.PASSWORD && !loginData.password) {
      setFormError("Password is required");
      return;
    }
    if (type === LOGIN_TYPE.OTP && code.length !== 6) {
      setOtpErrorMsg("OTP must be 6 digits");
      return;
    }
    loginMutation({ ...loginData, otp: code, type: type });
  }


  const handleChangeOtp = (newOtp) => {
    setCode(newOtp);
  }

  const handleChangeLoginType = (typ) => {
    if (typ == LOGIN_TYPE.OTP) {
      setType(LOGIN_TYPE.OTP);
      setLoginData({ ...loginData, password: "" })
    } else {
      setType(LOGIN_TYPE.PASSWORD);
    }
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
              <form onSubmit={(e) => { e.preventDefault(); type == LOGIN_TYPE.OTP ? handlesendCode() : handleLogin() }}>
                <div className='space-y-4'>
                  <div>
                    <h2 className='text-xl font-semibold'>Sign In</h2>
                    <p className="text-sm opacity-70">
                      Join Netnity and start your language learning adventure!
                    </p>
                  </div>
                  <div className='space-y-3'>
                    <div className='form-control w-full'>
                      <label className='label'>Email</label>
                      <input
                        type='email'
                        placeholder='john@gmail.com'
                        className='input input-bordered w-full rounded-md outline-none focus:outline-none placeholder-base-content/50'
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>
                    <div className={`form-control w-full overflow-hidden transition-all duration-500 ease-in-out ${type === LOGIN_TYPE.OTP ? "opacity-0 max-h-0 scale-95 pointer-events-none" : "opacity-100 max-h-40 scale-100"}`}>
                      <label className='label'>Password</label>
                      <input
                        type='password'
                        placeholder='******'
                        className="input input-bordered w-full rounded-md outline-none focus:outline-none placeholder-base-content/50"
                        disabled={type == LOGIN_TYPE.OTP}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                    </div>
                    <div className='w-full flex items-center justify-end '>
                      {type == LOGIN_TYPE.OTP ? <p className='text-sm opacity-70 mr-4 hover:opacity-90 hover:cursor-pointer' onClick={() => handleChangeLoginType(LOGIN_TYPE.PASSWORD)}>Sign in using password</p> : <p className='text-sm opacity-70 mr-4 hover:opacity-90 hover:cursor-pointer' onClick={() => handleChangeLoginType("otp")}>Sign in using code</p>}
                    </div>
                  </div>
                </div>
                <button type='submit' className='btn btn-primary w-full rounded-md mt-6' disabled={type == 'otp' && otpLoading}>
                  {type == 'otp' ? (otpLoading ? (<span className="loading loading-dots loading-xl"></span>) : ("Send code")) : (isPending ? (<span className="loading loading-dots loading-xl"></span>) : "Sign In")}
                </button>
                <div className='text-center mt-1 flex flex-row items-center justify-center'>
                  <p className='textarea-sm'>
                    Don't have account?{" "}
                    <Link to="/signup" className='text-primary hover:underline'>Sign up</Link>
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
          <p className='max-w-96 text-xs md:text-sm lg:text-base md:max-w-xl lg:max-w-3xl text-center opacity-50 '>{`We've sent a 6-digit verification code to ${loginData.email}. Please enter the code below to complete the verification process.`}</p>
        </div>
        <div className='mt-4 flex flex-col items-center justify-center'>
          <OtpInput length={6} handleChangeOtp={handleChangeOtp} />
          {otpErrorMsg && <div className="mt-2 text-sm text-red-500 font-medium">
            {otpErrorMsg}
          </div>}
          <button onClick={handleLogin} type='submit' className='btn btn-primary w-full rounded-md mt-3 max-w-36 lg:max-w-56 lg:text' disabled={isPending || code.length !== 6}>{isPending ? (<span className="loading loading-dots loading-xl"></span>) : "Sign In"}</button>

        </div>
        <p className='text-xs mt-6 lg:mt-7 lg:text-sm '>
          <span>Want to change your Email Address?</span>{" "}
          <span className='hover:cursor-pointer hover:underline hover:text-primary/90 font-bold' onClick={() => setStep(STEP.FILL)}>Change here</span>
        </p>
        <p className='text-xs mt-2 lg:text-sm hover:cursor-pointer hover:underline hover:text-primary/90 font-bold' onClick={handlesendCode}>Resend code</p>
      </div >
      }
    </div >
  )
}

export default LoginPage