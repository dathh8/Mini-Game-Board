import React from 'react';
import img from '../images/battleship-large.svg';
import '../style.css'

const BattleShip = () => {
    return (
        <body>
        <div class="splash-container">
          <h1 class="splash-title">Battleship</h1>
          <div>
            <a href="/battle-ship/singleplayer" class="btn splash-btn">Single Player</a>
            <a href="/battle-ship/multiplayer" class="btn splash-btn">Multiplayer</a>
          </div>
        </div>
        <img src={img} class="splash-battleship-image"/>
      </body>
    );
};

export default BattleShip;
