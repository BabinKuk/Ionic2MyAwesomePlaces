import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Place } from '../../models/place';
import { PlacesService } from '../../services/places.service';

/**
 * Generated class for the PlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {

  place: Place;
  index: number;

  constructor(public navParams: NavParams,
    private viewCtrl: ViewController,
    private placesService: PlacesService) {
    this.place = this.navParams.get('place');
    this.index = this.navParams.get('index');
  }

  /* ionViewDidLoad() {
    console.log('ionViewDidLoad PlacePage');
  } */

  onLeave() {
    //console.log('leave');
    this.viewCtrl.dismiss();
  }

  onDelete() {
    //console.log('delete');
    this.placesService.deletePlace(this.index);
    this.onLeave();
  }

}
