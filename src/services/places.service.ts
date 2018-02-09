import { Place } from "../models/place";
import { Location } from "../models/location";
import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";
import { File } from '@ionic-native/file';

// available only on native device
declare var cordova: any;

@Injectable()
export class PlacesService {

  // init default data
  private places: Place[] = [];

  constructor(private storage: Storage, private file: File) {}

  addPlace(title: string, description: string, location: Location, imageUrl: string) {
    //console.log('add place ', title, description, location, imageUrl);
    // create new place object and push to array
    let place = new Place(title, description, location, imageUrl);
    this.places.push(place);

    // otkomentirati nakon deploya na device
    /*
    // set a key/value
    this.storage.set('places', this.places)
      .then(
        // do nothing
      )
      .catch(
        err => {
          // handle error, remove last place from array
          this.places.splice(this.places.indexOf(place), 1);
        }
      );
    */
  }

  loadPlaces() {
    console.log('load places', this.places);
    // return array copy
    return this.places.slice();
  }

  fetchPlaces() {
    // get a key/value pair
    return this.storage.get('places')
      .then(
        (places: Place[]) => {
          // if null then []
          return this.places = places != null ? places : [];
        }
      )
      .catch(
        err => {
          // handle error
          console.log(err);
        }
      );
  }

  deletePlace(index: number) {
    console.log('delete place');
    // remove from array
    this.places.splice(index, 1);
    //console.log(this.places);
    /* otkomentiraj nakon deploya na device
    // update storage
    this.storage.set('places', this.places)
      .then(
        this.removeFile(file);
      )
      .catch(
        err => console.log(err);
      );
    */
  }

  private removeFile(place: Place) {
    console.log('remove file');
    let currentName = place.imageUrl.replace(/^.*[\\\/]/, ''); // ostavi samo filename
    this.file.removeFile(cordova.file.dataDirectory, currentName)
    .then(
      // do nothing
    )
    .catch(
      () => {
        console.log('Error removing file');
        // add place again
        this.addPlace(place.title, place.description, place.location, place.imageUrl);
      }
    );
  }
}
