import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Location } from '../../models/location';

/**
 * Generated class for the SetLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {

  location: Location;
  marker: Location;

  constructor(public navParams: NavParams,
    private viewCtrl: ViewController) {
    this.location = this.navParams.get('location');
    // init marker if default loc data is changed
    if (this.navParams.get('isSet')) {
      this.marker = this.location;
    }
  }

  /* ionViewDidLoad() {
    console.log('ionViewDidLoad SetLocationPage');
  } */

  onSetMarker(event: any) {
    //console.log('onSetMarker', event);
    this.marker = new Location(event.coords.lat, event.coords.lng);
    console.log('marker set', this.marker);
  }

  onConfirm() {
    // dismiss modal and pass back the saved marker
    this.viewCtrl.dismiss({location: this.marker});
  }

  onAbort() {
    this.viewCtrl.dismiss();
  }
}
