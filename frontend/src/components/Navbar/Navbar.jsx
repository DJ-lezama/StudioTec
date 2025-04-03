import React from "react";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import UserProfile from "./UserProfile";

function Navbar() {
    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-textMain">
            <div className="flex items-center justify-between w-full">
                <Logo />
                <NavMenu />
            </div>
            <UserProfile />
        </header>
    );
}

export default Navbar;
