import React from 'react'

const ChatLoader = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center p-4">
            <span className="loading loading-dots loading-xl"></span>
            <p className="mt-4 text-center text-lg font-mono">Connecting to chat...</p>
        </div>
    )
}

export default ChatLoader