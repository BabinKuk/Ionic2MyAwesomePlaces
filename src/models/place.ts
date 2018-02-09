import { Location } from './location';

export class Place {

  title: string;
  description: string;
  location: Location;
  imageUrl: string;

  constructor(title: string,
    description: string,
    location: Location,
    imageUrl: string) {
      this.title = title;
      this.description = description;
      this.location = location;
      this.imageUrl = imageUrl;
  }
}
