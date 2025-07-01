import React, { useState } from 'react'

const OtpInput = ({ length, handleChangeOtp}) => {
    const [otp, setOtp] = useState(new Array(length).fill(""))

    const handleChange = (element, index) => {

        if (index > 0 && otp[index - 1] === "") return;

        const value = element.value;
        if (!/^[0-9]$/.test(value)) return;


        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp)

        if (index < length - 1 && value) {
            element.nextElementSibling?.focus();
        }
        handleChangeOtp(newOtp.join(''))
    }

    const handleBackspace = (element, index) => {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp)
        if (index > 0) {
            element.previousElementSibling?.focus();
        }
        handleChangeOtp(newOtp.join(''))
    }

    return (
        <div className='space-x-4 flex items-center justify-center'>{otp.map((data, index) => (
            <input
                key={index}
                type='text'
                maxLength={1}
                value={data}
                inputMode="numeric"
                pattern="[0-9]*"
                className='input input-bordered w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-center text-xl rounded-md focus:outline-none focus:bg-secondary focus:bg-opacity-5'
                onChange={e => handleChange(e.target, index)}
                onKeyDown={e => {
                    if (e.key === "Backspace") {
                        handleBackspace(e.target, index)
                    }
                }}
            />
        ))}</div>
    )
}

export default OtpInput