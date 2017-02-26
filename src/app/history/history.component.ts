import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GameAPI } from '../../utils/gamesApi';
import { GameData, Point, Locations, marker, markerLocation, gameData,Route } from '../../data/game_data';
import { AgmCoreModule, LatLngLiteral, LatLngBounds, SebmGoogleMap } from 'angular2-google-maps/core';

class SavedGame {
    id: string;
    numPlayers: number;
    date: Date;
    playerName: string;
}

@Component({
    selector: 'history',
    styleUrls: ['history.scss'],
    templateUrl: 'history.html',
    encapsulation: ViewEncapsulation.None
})

export class HistoryComponent implements OnInit {
    history: SavedGame[] = GameAPI.getAll();
    pointMap:Point = gameData.route.destPoint;
    locations:Point[];
    playerName: string = "";
    colors:string[]=["#ff2430","#bb08c3","#7916d1","#fdde09","#32db16","#12930f"];
    constructor() {

    }

    ngOnInit() {
        this.history = GameAPI.getAll();
    }

    viewMap(point:Point , pLocationsPoints:Point[]  , pPlayerName:string) {
        console.log("viewMap" , point);
        this.pointMap = point;
        console.log("pointMap"+this.pointMap.lat);
        this.locations = pLocationsPoints;
        this.playerName = pPlayerName;
    }
   
}






