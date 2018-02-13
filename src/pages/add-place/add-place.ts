import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File, Entry, FileError } from '@ionic-native/file';

import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../models/location';
import { PlacesService } from '../../services/places.service';

// available only on native device
declare var cordova: any;
/**
 * Generated class for the AddPlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {

  // init default data
  location: Location = {
    lat: 44.8688448,
    lng: 13.8413472
  };
  // flg if default location changed
  locationIsSet: boolean = false;
  imageUrl: string = '';
  imageUrlTest: string = 'assets/imgs/logo.png';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private geolocation: Geolocation,
    private camera: Camera,
    private file: File,
    private placesService: PlacesService) {
  }

  /* ionViewDidLoad() {
    console.log('ionViewDidLoad AddPlacePage');
  } */

  onLocate() {
    //console.log('onLocate');
    let loader = this.loadingCtrl.create({
      content: "Getting your location. Please wait..."
    });
    loader.present();
    // get current position
    this.geolocation.getCurrentPosition()
      .then((location) => {
        //console.log('Current location', location);
        loader.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.locationIsSet = true;
      }).catch((error) => {
        loader.dismiss();
        //console.log('Error getting location', error);
        this.presentToast('Error getting current location. Please try again later...');
      });
  }

  onOpenMap() {
    //console.log('onOpenMap');
    // open modal and pass it the location data
    let modal = this.modalCtrl.create(SetLocationPage, {
      location: this.location,
      isSet: this.locationIsSet
    });
    modal.present();

    // listen to data coming from modal
    modal.onDidDismiss(
      data => {
        // change default location
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    );
  }

  onTakePhoto() {
    //console.log('onTakePhoto');
    const options: CameraOptions = {
      quality: 100,
      //destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      //mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options)
      .then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        //let base64Image = 'data:image/jpeg;base64,' + imageData;

        //console.log(err);
        //this.presentToast(base64Image.toString());
        // image name
        let currentName = imageData.replace(/^.*[\\\/]/, ''); // ostavi samo filename
        let path = imageData.replace(/[^\/]*$/, ''); // ostavi samo path
        let newFileName = new Date().getUTCMilliseconds() + '.jpg';
        //console.log('currentName', currentName);
        //console.log('path', path);
        //console.log('newName', newFileName);

        // move file
        this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
          .then(
            (data: Entry) => {
              //console.log('data', data);
              this.imageUrl = data.nativeURL; // new path
              this.camera.cleanup(); // clean camera memory
              //this.file.removeFile(path,currentName);
            }
          )
          .catch(
            (err: FileError) => {
              // Handle error
              //console.log(err);
              this.presentToast('Could not save the image. Please try again.');

              this.imageUrl = '';
              this.camera.cleanup();
            }
          );

        this.imageUrl = imageData;
        //console.log('imageUrl', this.imageUrl);
      }, (err) => {
        // Handle error
        //console.log(err);
        this.presentToast('Could not take the image. Please try again.');
        // otkomentirati nakon deploya na device
        //this.imageUrl = this.imageUrlTest;
      });
  }

  onSubmit(form: NgForm) {
    //console.log('onSubmit', form.value);
    // submit form
    this.placesService
      .addPlace(form.value.title, form.value.description, this.location, this.imageUrl);

    // reset form
    form.reset();
    this.location = {
      lat: 44.8688448,
      lng: 13.8413472
    };
    this.locationIsSet = false;
    this.imageUrl = '';
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
