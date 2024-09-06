import React from 'react';
import './home.css';
import imgGameBattleShip from './images/game-battle-ship.png'; 
import imsXo from './images/game-xo.png'; 
import imsBoom from './images/game-boom.png'; 
import { useNavigate } from 'react-router-dom';
const Header = React.lazy(() => import('../../Header/header'));
const Footer = React.lazy(() => import('../../Footer/footer'));

const HomePage = () => {
    let navigate = useNavigate(); 
    const routeChange = (path) =>{ 
        navigate(path);
    }
    return (
        <div class="home-page">
            <Header/>
            <aside>
                <div class="sidebar">
                    <div class="sidebar-header">
                        <span class="home">HOME</span>
                        <span class="active">Steam</span>
                    </div>
                    <input type="text" placeholder="Search"/>
                    <h2>ALL GAMES</h2>
                    <ul>
                        {/* <!-- Example of a game list --> */}
                        <li>The Adventure Pals</li>
                        <li>Baldur's Gate 3</li>
                        <li>Baldur's Gate: Enhanced Edition</li>
                        {/* <!-- Add more games here --> */}
                    </ul>
                </div>
            </aside>

            <main>
                <section class="content">
                    <div class="section-header">
                        <h3>WHAT'S NEW</h3>
                    </div>
                    <div class="news-banner">
                        <div class="banner-item">
                            <img src="" alt="Game News 1"/>
                            <div class="banner-overlay">
                                <span>One in the Chamber Tournament</span>
                            </div>
                        </div>
                        <div class="banner-item">
                            <img src="" alt="Game News 2"/>
                            <div class="banner-overlay">
                                <span>Team Fortress 2 Update Released</span>
                            </div>
                        </div>
                    </div>
                    <div class="recent-games">
                        <h3>Our Games</h3>
                        <div class="games-grid">
                            {/* <!-- Example games --> */}
                            <div class="game-card" onClick={() => { navigate('/battle-ship')}}>
                                <img src={imgGameBattleShip} alt="Battle Ship"/>
                                <div class="game-info">
                                    <span>Battle Ship</span>
                                </div>
                            </div>
                            <div class="game-card" onClick={() => { navigate('/xo')}}>
                                <img src={imsXo} alt="Xo"/>
                                <div class="game-info">
                                    <span>XO Game</span>
                                </div>
                            </div>
                            <div class="game-card">
                                <img src={imsBoom} alt="Dungeon Defenders"/>
                                <div class="game-info">
                                    <span>Dungeon Defenders</span>
                                </div>
                            </div>
                            {/* <!-- Add more games here --> */}
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </div>
    );
};

export default HomePage;
