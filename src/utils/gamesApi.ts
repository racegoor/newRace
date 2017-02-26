//we use local storage to simulate sending and persisting data to a remote server
import {SavedGame} from '../data/game_data';
import moment = require("moment");


function id() {
    return '1';
}

const bgColors:string[] = ["green", "yellow"];

export const GameAPI = {
    getAll: () => {
        return JSON.parse(localStorage.getItem('games')) || [];
    },

    saveGame: (game) => {
        let tempStorage = JSON.parse(localStorage.getItem('games')) || [];
        let gameId = id();
        const newGame: SavedGame = {
            id: gameId,
            playerName: game.playerName,
            numPlayers: game.numPlayers,
            date: moment().format('DD/MM/YYYY'),
            dateEnd: game.dateEnd,
            //winLevel: game.winLevel,
            dateStart: game.dateStart,
            time: moment.utc(moment((game.dateEnd),"DD/MM/YYYY HH:mm:ss").diff(moment((game.dateStart),"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss"),
            routePoints: game.routePoints,
            route: game.route,
        };
        tempStorage.push(newGame);
        console.log('tempStorage', tempStorage);
        localStorage.setItem('games', JSON.stringify(tempStorage));
    }
}
