import React from "react";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import UserProfile from "./UserProfile";

function Navbar() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-white shadow-sm h-20">
            <div className="flex items-center justify-between w-full">
                <Logo />
                <NavMenu />
            </div>
            <UserProfile />
        </header>
    );
}

export default Navbar;
