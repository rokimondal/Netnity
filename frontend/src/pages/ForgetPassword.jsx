import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser';
import OtpInput from '../components/OtpInput';
import useSendOtp from '../hooks/useSendOtp';
import useVerifyCode from '../hooks/useVerifyCode';
import useResetPassword from '../hooks/useResetPassword';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router';

const STEP = {
  sendCode: "SEND-CODE",
  verifyCode: "VERIFY-CODE",
  resetPassword: "RESET_PASSWORD"
}

const ForgetPassword = () => {

  const { authUser } = useAuthUser();
  const userEmail = authUser.email;

  const [step, setStep] = useState(STEP.sendCode);
  const [code, setCode] = useState("")
  const [verifyCodeError, setVerifyCodeError] = useState("");
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState("")
  const navigate = useNavigate();

  const { otpMutation, otpLoading } = useSendOtp({
    onSuccess: () => {
      setStep(STEP.verifyCode);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "";
      console.log(message);

    }
  })

  const { verifyCodeMutation, verifyCodeLoading } = useVerifyCode({
    onSuccess: (data) => {
      setResetToken(data.resetToken);
      setStep(STEP.resetPassword);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "";
      setVerifyCodeError(message);

    }
  })

  const { resetPasswordMutation, resetPasswordLoading } = useResetPassword({
    onSuccess: (data) => {
      toast.success("Password updated successfully.");
      navigate("/");
    },
    onError: (error) => {
      const message = error?.response?.data?.message || "";
      setFormError(message);

    }
  })

  const handlesendCode = () => {
    setCode("");
    const sendCodeData = {
      email: userEmail,
      purpose: "resetPassword"
    }
    otpMutation(sendCodeData);
  }

  const handleVerifyCode = () => {
    const verifyCodeData = {
      code
    }
    verifyCodeMutation(verifyCodeData);
  }

  const handleresetPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }
    if (newPassword != confirmPassword) {
      setFormError("Both passwords must be the same.");
      return;
    }
    const resetData = {
      resetToken,
      newPassword
    }
    resetPasswordMutation(resetData);
  }



  const handleChangeOtp = (newOtp) => {
    setCode(newOtp);
  }

  const maskEmail = (email) => {
    const [local, domain] = email.split("@");
    if (local.length <= 2) {
      return local[0] + "*".repeat(local.length - 1) + "@" + domain;
    } else {
      const visible = local.slice(0, 2);
      const hidden = "*".repeat(local.length - 2);
      return visible + hidden + "@" + domain;
    }
  }

  return (
    <div className='flex justify-center items-center min-h-[90vh] bg-base-100'>
      <div className='w-full max-w-lg p-6 space-y-6 '>
        {step === STEP.sendCode && (
          <>
            <h2 className='text-2xl font-bold text-center'>Forgot Your Password?</h2>
            <p className='text-center'>
              We’ll send a verification code to <span className="font-semibold">{maskEmail(userEmail)}</span>
            </p>
            <button className='btn btn-primary w-full' disabled={otpLoading} onClick={handlesendCode}>
              {otpLoading ? (<span className="loading loading-dots loading-xl"></span>) : "Send Verification Code"}
            </button>
          </>
        )}

        {step === STEP.verifyCode && (
          <>
            <h2 className='text-2xl font-bold text-center'>Enter Verification Code</h2>
            <p className='text-center'>
              We sent a code to <span className='font-semibold'>{maskEmail(userEmail)}</span>
            </p>
            <OtpInput length={6} handleChangeOtp={handleChangeOtp} />
            {verifyCodeError && <div className="mt-2 text-sm text-red-500 font-medium">
              {verifyCodeError}
            </div>}
            <button className='btn btn-primary w-full' onClick={handleVerifyCode} disabled={code.length != 6 || verifyCodeLoading}>
              {verifyCodeLoading ? (<span className="loading loading-dots loading-xl"></span>) : "Verify Code"}

            </button>
            <p className='text-sm text-center text-gray-500'>
              Didn’t get the code? <button className='link link-primary' onClick={handlesendCode}>Resend</button>
            </p>
          </>
        )}

        {step === STEP.resetPassword && (
          <div>
            <h2 className='text-2xl font-bold text-center mb-2'>Set a New Password</h2>
            <form onSubmit={handleresetPassword}>
              <div className='form-control w-full'>
                <input
                  type='password'
                  placeholder='New Password'
                  className='input placeholder-base-content/50 input-bordered w-full outline-none focus:outline-none'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-xs opacity-70 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>
              <div className='form-control w-full mt-4'>
                <input
                  type='password'
                  placeholder='Confirm Password'
                  className='input placeholder-base-content/50 input-bordered w-full outline-none focus:outline-none'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button className='btn btn-primary w-full mt-4' type='submit' disabled={newPassword.length < 6 || newPassword != confirmPassword}>
                {resetPasswordLoading ? (<span className="loading loading-dots loading-xl"></span>) : "Reset Password"}
              </button>
              {formError && <div className="mt-2 text-sm text-red-500 font-medium">
                {formError}
              </div>}
            </form>

          </div>
        )}
      </div>
    </div >
  )
}

export default ForgetPassword