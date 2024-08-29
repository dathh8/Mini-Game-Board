import React from 'react';

const Header = () => {
    return (
        <header>
        <div class="menu-bar">
            <div class="logo">
                <a href="#">Mini Games</a>
            </div>
            <div class="menu-items">
                <a href="/battle-ship" >STORE</a>
                <a href="#">LIBRARY</a>
                <a href="#">COMMUNITY</a>
            </div>
            <div class="user-profile">
                <div class="notifications">
                    <span class="notification-icon"></span>
                </div>
                <span class="user-name">User Name</span>
                <div class="profile-icon"></div>
            </div>
        </div>
    </header>
    );
};

export default Header;
