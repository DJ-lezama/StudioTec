import React from "react";

function UserProfile({ className = "ml-6" }) {
  return (
    <button
      className={`flex justify-center items-center w-12 h-12 bg-[#F2F4F8] rounded-full ${className}`}
      aria-label="User profile"
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/26ff9c68dc9daaf60db1b504554c3b7df11aae3e?placeholderIfAbsent=true"
        alt="User"
        className="w-6 h-6 object-contain"
      />
    </button>
  );
}

export default UserProfile;
