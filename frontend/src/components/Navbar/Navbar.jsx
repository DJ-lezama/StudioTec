import React from "react";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import UserProfile from "./UserProfile";

function Navbar() {
    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-textMain">
            <div className="flex gap-10 items-center">
                <Logo />
                <NavMenu />
            </div>
            <UserProfile />
        </header>
    );
}

export default Navbar;
