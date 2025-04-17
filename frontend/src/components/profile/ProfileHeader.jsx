import React from "react"

const ProfileHeader = ({ user }) => {
    return (
        <div className="md:hidden bg-primary/10 p-6 flex items-center space-x-4 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white text-xl font-bold">
                {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <h2 className="text-lg font-semibold text-textMain">
                    {user.name}
                </h2>
                <p className="text-sm text-textMain/70">{user.email}</p>
            </div>
        </div>
    )
}

export default ProfileHeader
