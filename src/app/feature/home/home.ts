import { Component } from '@angular/core';
import { Landing } from './landing/landing';


@Component({
  selector: 'app-home',
  imports: [Landing],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
