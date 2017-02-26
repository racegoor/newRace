import { Component, OnInit, ViewEncapsulation, Input, EventEmitter,ViewChild } from '@angular/core';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { GameData, gameData, Locations, locations, markerLocation, markersLocation } from '../../data/game_data';

class Point {
    lat: number;
    lng: number;
}

@Component({
    selector: 'gameBoard',
    styleUrls: ['gameBoard.scss'],
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

    @ViewChild('gameMapChild') gameMap;

    constructor() {
    }

    ngOnInit() {
        this.currentPoint = { lat: 10, lng: 10 };
        for (let i = 0; i < this.gameData.numPlayers; i++)
            this.playersLocation[i] = {
                currentLocation: this.currentPoint,
                marker: i.toString()
            }
        this.startAnimate();
        //this.gameMap.addPlayersToMap();
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
            let otherStatus = -1;
            for(let i=0;i<gameData.numPlayers;i++){
                if(this.playersLocation[i].currentLocation.lat.toFixed(2) == this.gameData.route.destPoint.lat.toFixed(2)
                && this.playersLocation[i].currentLocation.lng.toFixed(2) == this.gameData.route.destPoint.lng.toFixed(2)){
                    otherStatus++;
                }
                if(otherStatus > this.gameData.numPlayers/2)
                {
                    $("#winnerImg").attr("src","../../images/winner3.png");
                    console.log("//winner3");
                }
                else{
                if(otherStatus > this.gameData.numPlayers/3){
                    $("#winnerImg").attr("src","../../images/winner2.png");
                    console.log("//winner2");
                }
                else{
                    $("#winnerImg").attr("src","../../images/winner1.png");
                    console.log("//winner1");
                }
                }
            }
            $('#myModal').modal('show');
        }
    }

    changeMarkersLocation(event: any) {
        this.playersLocation[event.index] = {
            currentLocation: event.currentLocation,
            marker: event.marker
        }
    }

    startAnimate(){
        $("#element").addClass("element");
        let index = 10;
        let animateStart = setInterval(()=>{
            index--;
            document.getElementById("element").innerText = index.toString();
            if(index==0){
                clearInterval(animateStart);  
                $("#element").removeClass("element"); 
                $("#element").hide();
                                           
            }
        }, 1500)        
    }

    replaceMaps() {
        /*let mapNormal = document.getElementById('map-normal');
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
        }*/
        /*$("#bigMap").hide();
        $(".addrow").removeClass("col-md-6").addClass("row");
        $(".3coulmn").addClass("col-md-3");
        $(".9coulmn").addClass("col-md-9");
        $(".detailBox").removeClass("col-md-6").addClass("col-md-12");*/
    }
}







