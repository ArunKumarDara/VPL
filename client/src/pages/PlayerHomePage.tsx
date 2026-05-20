import React from 'react'
import Navbar from '@/components/Navbar'

const PlayerHomePage = () => {
    return (
        <div className="min-h-screen bg-[#050816] text-white">
            <Navbar />

            <div className="flex min-h-screen items-center justify-center text-5xl font-black">
                Players Page
            </div>
        </div>
    )
}

export default PlayerHomePage