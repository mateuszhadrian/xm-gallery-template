import { Component } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatFabButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
