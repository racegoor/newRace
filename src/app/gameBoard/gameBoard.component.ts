import { Component, OnInit, ViewEncapsulation, Input, EventEmitter } from '@angular/core';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { GameData, gameData, Locations, locations, markerLocation, markersLocation } from '../../data/game_data';

class Point {
    lat: number;
    lng: number;
}

@Component({
    selector: 'gameBoard',
    styleUrls: ['gameBoard.css'],
    templateUrl: 'gameBoard.html',
    encapsulation: ViewEncapsulation.None
})

export class GameBoardComponent implements OnInit {
    distance: string;
    currentAddress: string;
    success: boolean;
    timePast: string;
    gameData: GameData = gameData;
    playersLocation: { [id: string]: markerLocation; } = {};
    locations: Locations = locations;
    currentPoint: Point;

    constructor() {
    }

    ngOnInit() {
        this.currentPoint = { lat: 10, lng: 10 };
        for (let i = 0; i < this.gameData.numPlayers; i++)
            this.playersLocation[i] = {
                currentLocation: this.currentPoint,
                marker: i.toString()
            }
    }

    distanceFormat(event: any) {
        this.distance = event.distance;
        this.currentAddress = event.currentAddress;
        this.currentPoint = event.currentPoint;
        this.locations.addPoint(this.currentPoint.lat, this.currentPoint.lng);
    }

    isSuccess(event: boolean) {
        this.success = event;
        if (this.success == true) {
            $(".winImg").css("z-index", "1000");
        }
    }

    changeMarkersLocation(event: any) {
        this.playersLocation[event.index] = {
            currentLocation: event.currentLocation,
            marker: event.marker
        }
    }

    replaceMaps() {
        let mapNormal = document.getElementById('map-normal');
        let mapPanorama = document.getElementById('map-panorama');
        if (mapNormal.parentElement.id == 'smallMap') {
            $(mapPanorama).addClass("col-md-9");
            $(mapNormal).removeClass("col-md-9");
            document.getElementById('bigMap').removeChild(mapPanorama);
            document.getElementById('smallMap').appendChild(mapPanorama)            
            document.getElementById('smallMap').removeChild(mapNormal);
            document.getElementById('bigMap').appendChild(mapNormal);
        }
        else
        if (mapNormal.parentElement.id == 'bigMap') {
            $(mapNormal).addClass("col-md-9");
            $(mapPanorama).removeClass("col-md-9");
            document.getElementById('bigMap').removeChild(mapNormal);
            document.getElementById('smallMap').appendChild(mapNormal);
            document.getElementById('smallMap').removeChild(mapPanorama);
            document.getElementById('bigMap').appendChild(mapPanorama);
        }

    }
}







