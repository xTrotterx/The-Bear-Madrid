import { Component } from '@angular/core';
import { NavComponent } from "./navComponent/nav.component";

import { FooterComponent } from "./footerComponent/footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-lay-out',
  imports: [NavComponent, RouterOutlet, FooterComponent],
  templateUrl: './lay-out.component.html',
  styleUrl: './lay-out.component.css'
})
export class LayOutComponent {

}
