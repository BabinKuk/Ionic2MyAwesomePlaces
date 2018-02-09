import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';
import { Place } from '../../models/place';
import { PlacesService } from '../../services/places.service';
import { PlacePage } from '../place/place';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  addPlacePage = AddPlacePage;
  places: Place[] = [];

  constructor(public modalCtrl: ModalController,
    private placesService: PlacesService) {
  }

  ngOnInit() {
    // get places array
    this.placesService.fetchPlaces()
      .then(
        (places: Place[]) => this.places = places
      );
  }

  ionViewWillEnter() {
    // get places array
    this.places = this.placesService.loadPlaces();
    //console.log(this.places);
  }

  onOpenPlace(place: Place, index: number) {
    console.log('open place details', place);
    let modal = this.modalCtrl.create(PlacePage, {
      place: place,
      index: index
    });
    modal.present();
  }

}
