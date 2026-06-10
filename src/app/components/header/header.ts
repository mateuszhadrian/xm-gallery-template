import { Component } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatFabButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
