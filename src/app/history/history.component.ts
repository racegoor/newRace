import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GameAPI } from '../../utils/gamesApi';
import { GameData, Point, Locations, marker, markerLocation, gameData } from '../../data/game_data';
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
    pointMap:Point={lat:32.115633 , lng:34.84027600000002};
    locations:Point[];
    colors:string[]=["#ffc200","#b70056","#d33c79","#3d9243","#ef5425"];
    constructor() {

    }

    ngOnInit() {
        this.history = GameAPI.getAll();
    }

    viewMap(point:Point , locationsPoints:Point[]) {
        this.pointMap = point;
        this.locations = locationsPoints;
        $("#map").css("visibility", "visible");
    }

   
}






