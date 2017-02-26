import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { AgmCoreModule, LatLngLiteral, LatLngBounds, SebmGoogleMap } from 'angular2-google-maps/core';
import { GameData, Point, Locations, marker, markerLocation, gameData } from '../../data/game_data';
import { MapsAPILoader, NoOpMapsAPILoader, MouseEvent } from 'angular2-google-maps/core';
import * as mapTypes from 'angular2-google-maps/services/google-maps-types';

interface RouteDriving {
    points: Point[];
}

@Component({
    selector: 'gameMap',
    styleUrls: ['gameMap.scss'],
    templateUrl: 'gameMap.html',
    encapsulation: ViewEncapsulation.None
})

export class GameMapComponent implements OnInit {
    @Input() gameData: GameData = gameData;
    @Input() currentPoint: Point;
    @Input() locations: Locations;
    @Output() onChangeMarkersLocation: EventEmitter<Object> = new EventEmitter<Object>();
    playersLocation: markerLocation
    point: Point = gameData.route.sourcePoint;
    source: Point;
    destination: Point;
    driving: RouteDriving[] = [];
    markers: marker[] = [];
    success: boolean = false;
    icons: string[] = ['', 'green-dot', 'blue-dot', 'pink-dot', 'orange-dot'];
    flag: string = "../../images/zw.png";
    constructor() {
        let name = this.gameData.player[0].toUpperCase();
        this.icons[0] ="markers/"+name+"-"+this.gameData.carColor;
    }

    ngOnInit() {
        this.markers.push({
            lat: this.currentPoint.lat,
            lng: this.currentPoint.lng,
            label: "ME",
            draggable: false,
            iconUrl: '../../images/' + this.icons[0] + '.png'
        })

        for (let i = 0; i < this.gameData.numPlayers; i++) {
            this.onChangeMarkersLocation.emit(
                {
                    currentLocation: this.gameData.route.sourcePoint,
                    marker: '../../images/' + this.icons[i] + '.png',
                    index: i
                });
        }
    }

    renderMarkers() {
        console.log('render markers', this.markers, this.gameData.numPlayers)
        //TODO: add markers from the code
        this.markers[0].lat = this.gameData.route.sourcePoint.lat;
        this.markers[0].lng = this.gameData.route.sourcePoint.lng;
        let loc = 0
        for (let index = 1; index < this.gameData.numPlayers; index++) {
            if (this.markers.length <= this.gameData.numPlayers) {
                this.markers.push({
                    lat: this.gameData.route.sourcePoint.lat,
                    lng: this.gameData.route.sourcePoint.lng + loc,
                    label: "player" + index,
                    draggable: false,
                    iconUrl: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                })
                loc += 0.0003;
            }
        }
        console.log('numPlayers', this.markers, this.gameData.numPlayers)
    }


    moveSinglePoint(index: number, delay: number) {
        let i = 0;
        let moveOtherPoints = setInterval(() => {
            if (this.driving[index - 1] && this.driving[index - 1].points[i]) {
                this.markers[index].lat = this.driving[index - 1].points[i].lat;
                this.markers[index].lng = this.driving[index - 1].points[i].lng;
            }
            this.onChangeMarkersLocation.emit(
                {
                    currentLocation: { lat: this.markers[index].lat, lng: this.markers[index].lng },
                    marker: '../../images/' + this.icons[index] + '.png',
                    index: index
                });
            if (this.success || this.markers[0].lat.toFixed(3) == this.gameData.route.destPoint.lat.toFixed(3)
                && this.markers[0].lng.toFixed(3) == this.gameData.route.destPoint.lng.toFixed(3)) {
                clearInterval(moveOtherPoints);
            }
            i++;

        }, 500);
    }

    movePlayerPoint() {
        this.markers[0].lat = this.gameData.route.sourcePoint.lat;
        this.markers[0].lng = this.gameData.route.sourcePoint.lng;
        this.markers[0].label = "ME";
        let movePlayer = setInterval(() => {
            //console.log('this.locations', this.locations);
            this.point.lat = this.markers[0].lat = this.currentPoint.lat;
            this.point.lng = this.markers[0].lng = this.currentPoint.lng;
            this.onChangeMarkersLocation.emit(
                {
                    currentLocation: this.currentPoint,
                    marker: '../../images/' + this.icons[0] + '.png',
                    index: 0
                });
            if (this.markers[0].lat.toFixed(3) == this.gameData.route.destPoint.lat.toFixed(3)
                && this.markers[0].lng.toFixed(3) == this.gameData.route.destPoint.lng.toFixed(3)) {
                this.success = true;
                clearInterval(movePlayer);
                this.onChangeMarkersLocation.emit(
                    {
                        currentLocation: this.gameData.route.destPoint,
                        marker: '../../images/' + this.icons[0] + '.png',
                        index: 0
                    });
            }
        }, 1000)

    }

    addWaypoint(index: number, createRouteFunc: any) {
        let wayPointRes;
        let movePoint = this.gameData.route.sourcePoint;
        let geocoder3 = new google.maps.Geocoder();
        let lat;
        let lng;
        if(index%2){
            lat = index / 1200 - movePoint.lat;
            lng = index / 2500 + movePoint.lng;
        }
        else{
            lat = index / 20000 + movePoint.lat;
            lng = index / 1200 + movePoint.lng;
        }
        let newMovePoint: Point = { lat:lat, lng:lng }
        geocoder3.geocode({ 'location': newMovePoint }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                wayPointRes = results[0].formatted_address.toString();
            }
            else {
                wayPointRes = this.gameData.route.source;
            }
            createRouteFunc(wayPointRes);
        });
    }

    createRouteForOther(index, callback) {
        let me = this;
        console.log("me", me);
        this.addWaypoint(index, function (wayPoint: string) {
            let _callback = callback.bind(me);
            let directionsDisplay;
            let directionsService = new google.maps.DirectionsService();
            let start = new google.maps.LatLng(me.gameData.route.sourcePoint.lat, me.gameData.route.sourcePoint.lng);
            let end = new google.maps.LatLng(me.gameData.route.destPoint.lat, me.gameData.route.destPoint.lng);
            console.log("!!!!!!!!!!!!!!!!!", wayPoint);
            let request = {
                origin: start,
                destination: end,
                provideRouteAlternatives: true,
                travelMode: google.maps.TravelMode['DRIVING'],
                waypoints: [
                    {
                        location: wayPoint,//new google.maps.LatLng(wayPoint.lat,wayPoint.lng),
                        stopover: true
                    }],
            };
            //decide what to do there is no route - status != ok
            directionsService.route(request, (response, status) => {
                console.log("after req1", me);
                if (status == google.maps.DirectionsStatus.OK) {
                    console.log("some suggest", response.routes.length)
                    console.log(response.routes);
                    let pointsArray = response.routes[0].overview_path;
                    let tempDriving = { points: [] };
                    for (let i = 0; i < pointsArray.length; i++) {
                        tempDriving.points.push({ lat: pointsArray[i].lat(), lng: pointsArray[i].lng() })
                    }
                    me.driving.push(tempDriving);
                    console.log('set driving', me.driving);
                    _callback();
                }
            });
            console.log("create route sucess", index, me.driving);
        });

    }

    waitForSetRoutes() {
        console.log('this.waitForSetRoutes  ')
        let flag = 1;
        for (let i = 1; i < this.gameData.numPlayers; i++) {
            flag += this.driving[i - 1] ? 1 : 0;
        }
        if (flag == this.gameData.numPlayers) {
            console.log('this.waitForSetRoutes  finish')
            this.moveAllPoints();
        }

    }
    addPlayersToMap() {
        for (let index = 1; index < this.gameData.numPlayers; index++) {
            console.log("markers.length ", this.markers.length, "this.gameData.numPlayers", this.gameData.numPlayers);
            if (this.markers.length < this.gameData.numPlayers) {
                this.markers.push({
                    lat: this.gameData.route.sourcePoint.lat,
                    lng: this.gameData.route.sourcePoint.lng,
                    label: "player" + index,
                    draggable: false,
                    iconUrl: '../../images/' + this.icons[index] + '.png'
                })
                this.createRouteForOther(index, this.waitForSetRoutes);
                console.log('new marker', index, this.markers[index])
            }
        }
    }

    moveAllPoints() {
        let i = 0;
        this.markers[0].lat = this.currentPoint.lat;
        this.markers[0].lng = this.currentPoint.lng;
        for (let i = 1; i < this.gameData.numPlayers; i++) {
            if (this.driving[i - 1] && this.driving[i - 1].points.length != 0) {
                this.moveSinglePoint(i, i * 6000 / this.gameData.level);
            }
        }
        this.movePlayerPoint();
    }
}






