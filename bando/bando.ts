import { Component } from '@angular/core';
import { App, Loading, NavController, NavParams, ViewController, Platform} from 'ionic-angular';
import 'leaflet';
import 'leaflet.markercluster';
import { AuthProvider } from '../../providers/auth/auth';
import { ChamdiempgProvider } from '../../providers/chamdiempg/chamdiempg';
import { GiamsatProvider } from '../../providers/giamsat/giamsat';
//provider
import { SettingProvider } from '../../providers/setting/setting';
import { HomePage } from "../home/home";
import { LoginPage } from "../login/login";


declare let L: any;
@Component({
    selector: 'page-bando',
    templateUrl: 'bando.html',
})
export class BandoPage {
    loading: Loading;

    model: any = {};
    bgMap: string;

    private marker: any;
    private map: any;
    private _radius: number;
    private _latLng: any;
    private markers: any;
    private markersList: any = [];
    lat: any;
    addNew: any = false;
    long: any;
    checkpoint: any;
    target: any;
    constructor(public navCtrl: NavController,
        public chamdiempgProvider: ChamdiempgProvider,
        public viewCtrl: ViewController, public navParams: NavParams, public platform: Platform, private authProvider: AuthProvider, public settingProvider: SettingProvider, private giamsatProvider: GiamsatProvider, private app: App) {
        this.checkpoint = this.navParams.get('checkpoint');
        this.addNew = this.navParams.get('addNew');
        this.target = this.navParams.get('target');
        //console.log(this.target)
    }

    ionViewDidLoad() {
        //this.menu.enable(false);
        // workaround map is not correctly displayed
        // maybe this should be done in some other event
        this.loadMap();

    }

    //map
    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
        //this.circle.setRadius(value);
    }

    set latLng(value) {
        this._latLng = value;
        //this.circle.setLatLng(value);
        this.marker.setLatLng(value);
    }

    get latLng() {
        return this._latLng;
    }
    loadMap() {
        if (!this.authProvider.checkNetWork()) {
            this.authProvider.tryNetWorktoPost(() => this.loadMap());
            return;
        }
        this._latLng = L.latLng(17, 106);

        this.bgMap = this.settingProvider.getBackgroundMap().id;
        this.markersList = L.featureGroup([]);
        setTimeout(() => {

            this.map = L
                .map("mapdetail1", { attributionControl: false, layers: [this.markersList] })

            L.tileLayer(this.settingProvider.getBackgroundMap().path)
                .addTo(this.map);

            this.populatePG();

        })
    }


    setBackgroundColor(status) {

        if (status)
            return '#27ae60' // 
        else
            return 'red' // 

    }
    setTitle(status, targetType) {
        if (targetType != null) {
            switch (targetType) {
                case 1:
                    if (status == "V")
                        return 'Chấm vào ' // vào mục tiêu
                    else
                        return 'Chấm ra' // ra mục tiêu               
                case 0:
                    if (status == "V")
                        return 'Chấm vào sự kiện' // vào sự kiện
                    else
                        return 'Chấm ra sự kiện' // ra sự kiện
                default:
                    return "";
            }
        }
    }

    populatePG() {
        if (this.navParams.get("allCheckpoint") && this.navParams.get("allCheckpoint").length > 0) {


            for (let i = 0; i < this.navParams.get("allCheckpoint").length; i++) {
                let Targets = this.navParams.get("allCheckpoint")[i];
                if (this.checkpoint && this.checkpoint._id == Targets._id) {

                } else {
                    if (Targets.lat && Targets.long) {

                        let imgIcon: any;

                        imgIcon = L.divIcon({
                            className: 'mapicon',
                            html:
                            '<div class="marker labelRadius" style="background:' + this.setBackgroundColor(false) + '"></div><div style="margin-left: 14px;margin-top:-2px;width:fit-content">' + Targets.floor + '</div>',
                            style: {}
                        });


                        let m = new L.Marker(new L.LatLng(parseFloat(Targets.lat), parseFloat(Targets.long)), { icon: imgIcon });
                        this.markersList.addLayer(m);
                    }
                }

            }
            if (this.checkpoint) {
                //console.log(this.checkpoint)
                let Targets = this.checkpoint;
                if (Targets.lat && Targets.long) {

                    let imgIcon: any;

                    imgIcon = L.divIcon({
                        className: 'mapicon',
                        html:
                        '<div class="marker labelRadius" style="background:' + this.setBackgroundColor(true) + '"></div><div style="margin-left: 14px;margin-top:-2px;width:fit-content">' + Targets.floor + '</div>',
                        style: {}
                    });

                    //let m = new L.Marker(new L.LatLng(parseFloat(Targets.lat), parseFloat(Targets.long)), { icon: imgIcon });
                    //this.markersList.addLayer(m);
                    //this.map.setView(new L.LatLng(parseFloat(Targets.lat), parseFloat(Targets.long)), 18);

                    let m = new L.Marker(new L.LatLng(parseFloat(Targets.lat), parseFloat(Targets.long)), { icon: imgIcon });
                    this.markersList.addLayer(m);
                    this.map.setView(new L.LatLng(parseFloat(Targets.lat), parseFloat(Targets.long)), 18);
                } else {
                    this.geoFindMe();
                }

            }
        }
        if (this.navParams.get("allTargets") && this.navParams.get("allTargets").length > 0) {


            if (this.target) {
                //console.log(this.target)
                let Targets = this.target;
                if (Targets.lat && Targets.long) {

                    let imgIcon: any;

                    imgIcon = L.divIcon({
                        className: 'mapicon',
                        html:
                        '<div class="marker labelRadius" style="background:' + this.setBackgroundColor(true) + '"></div><div style="margin-left: 14px;margin-top:-2px;width: 30vw;">' + Targets.text + '</div>',
                        style: {}
                    });

                    //let m = new L.Marker(new L.LatLng(parseFloat(Targets.lat), parseFloat(Targets.long)), { icon: imgIcon });
                    //this.markersList.addLayer(m);
                    //this.map.setView(new L.LatLng(parseFloat(Targets.lat), parseFloat(Targets.long)), 18);

                    let m = new L.Marker(new L.LatLng(parseFloat(Targets.lat), parseFloat(Targets.long)), { icon: imgIcon });
                    this.markersList.addLayer(m);
                    this.map.setView(new L.LatLng(parseFloat(Targets.lat), parseFloat(Targets.long)), 18);
                } else {
                    this.geoFindMe();
                }

            }
        }
        if (!this.checkpoint && !this.target) {
            if (this.authProvider.getLocationTamp()) {
                let imgIcon: any;

                imgIcon = L.divIcon({
                    className: 'mapicon',
                    html:
                    '<div class="marker labelRadius" style="background:' + this.setBackgroundColor(true) + '"></div><div style="margin-left: 14px;margin-top:-2px;width:fit-content"></div>',
                    style: {}
                });

                let m = new L.Marker(new L.LatLng(parseFloat(this.authProvider.getLocationTamp().lat), parseFloat(this.authProvider.getLocationTamp().lng)), { icon: imgIcon });
                this.markersList.addLayer(m);
                this.map.setView(new L.LatLng(parseFloat(this.authProvider.getLocationTamp().lat), parseFloat(this.authProvider.getLocationTamp().lng)), 18);
            }
            this.geoFindMe();

        }



        return false;
    }
    locateGeoFindMe: any;
    findMe(lastGPS) {
        if (this.locateGeoFindMe) this.locateGeoFindMe.remove();
        let imgIcon = L.divIcon({
            className: 'mapicon',
            html: '<div class="gps_ring"></div>'
            + '<div class="marker labelRadius" style="background-image: url(assets/img/marker-icon.png);background-size: 12px 19px;"></div>',
            style: {}
        });
        this.locateGeoFindMe = new L.Marker(new L.LatLng(parseFloat(lastGPS.coords.latitude), parseFloat(lastGPS.coords.longitude)), { icon: imgIcon }).addTo(this.map);
        this.map.setView(new L.LatLng(parseFloat(lastGPS.coords.latitude), parseFloat(lastGPS.coords.longitude)), 18);
        if (this.authProvider.loading) this.authProvider.loading.dismiss();
    }
    geoFindMe() {
        //this.map.removeLayer(this.markersList);
        this.authProvider.showLoading1();
        if (this.locateGeoFindMe) this.locateGeoFindMe.remove();
        //if (this.authProvider.getLastGPS()) {
        //    lastGPS = this.authProvider.getLastGPS();
        //} else {
        //    this.getCurrentPos();
        //    lastGPS = this.authProvider.getLastGPS();
        //}



        //let m = new L.Marker(new L.LatLng(21.03097334504081, 105.78422596443784), { icon: imgIcon }).addTo(this.map);
        // this.map.setView(new L.LatLng(21.03097334504081, 105.78422596443784), 18);
        if (this.authProvider.getLastGPS()) {


            let timeDelta = new Date().getTime() - new Date(this.authProvider.getLastGPS().timestamp).getTime();
            let timeUpdate = 15000 * 1;
            // Khong cho phep user check in lien tuc (truong hop 2 cua hang gan nhau ko cho phep cung 1 vi tri checkin cho 2 cua hang...)
            if (timeDelta < timeUpdate) {

                this.findMe(this.authProvider.getLastGPS());
            } else {
                this.authProvider.getCurrentPosCallBack((location) => {
                    this.authProvider.setTimeStationary(location.timestamp);
                    this.authProvider.gpsTracking(location);
                    this.findMe(location);
                }, error => {
                    if (this.authProvider.loading) this.authProvider.loading.dismiss();                    
                });
            }
        } else {
            this.authProvider.getCurrentPosCallBack((location) => {
                this.authProvider.setTimeStationary(location.timestamp);
                this.authProvider.gpsTracking(location);
                this.findMe(location);
            }, error => {
                if (this.authProvider.loading) this.authProvider.loading.dismiss();
                
            });



        }

    }
    dismissPH() {

        this.viewCtrl.dismiss();
    }
    setLocationTarget() {
        //console.log(this.map.getCenter());
        let lat = this.map.getCenter().lat;
        let long = this.map.getCenter().lng;
        this.authProvider.showLoading();
        let obj = {
            "target": {
                "id": this.target._id
            },
            "lat": lat,
            "long": long,

        }

        this.chamdiempgProvider.putLocationTarget(obj).subscribe(data => {

            this.authProvider.loading.dismiss();
            if (data && data.result == true) {

                this.authProvider.showMessToat("Cập nhật thành công");
                this.viewCtrl.dismiss(true);
            }

        }, error => {
            this.authProvider.loading.dismiss();
            if (error.status == 403) {
                this.authProvider.logout();
                this.app.getRootNav().setRoot(LoginPage);
            } else {
                this.authProvider.tryNetWorktoServer(() => this.setLocationTarget());
            }
        })

    }
    getLocation() {
        this.authProvider.setLocationTamp(this.map.getCenter());
        this.viewCtrl.dismiss();
    }
    //click to show marker
    getCurrentPos() {
        let d1 = new Date();
        let d2 = new Date(this.authProvider.getLastGPS().timestamp);
        if (typeof localStorage.getItem('timeStationary_GuardMobile') != "undefined" && localStorage.getItem('timeStationary_GuardMobile') != null && typeof d2 != "undefined" && d2 != null) {
            this.authProvider.maxAge = d1.getTime() - d2.getTime();
        }

        this.authProvider.getCurrentPosCallBack((location) => {
            this.authProvider.gpsTracking(location);
        }, error => {
            
        });

    }

    centerLeafletMapOnMarker1(map, marker) {
        var latLngs = [marker.getLatLng()];
        var markerBounds = L.latLngBounds(latLngs);
        map.fitBounds(markerBounds);
    }

    onMarkerPositionChanged(e) {
        const latlng = e.target.getLatLng();

        this.latLng = latlng;
    }


    //get link to gg map

    fnHome() {
        try {
            this.app.getRootNav().setRoot(HomePage);
            //this.navCtrl.pop(DuyetdonPage);
        }
        catch (ex) {
            //console.log(ex);
        }
    }
}
