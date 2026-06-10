import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Header } from './header';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render buttons: Photos and Favorites', () => {
    const linkButtons = fixture.debugElement
      .queryAll(By.directive(RouterLink))
      .map((de) => de.injector.get(RouterLink).href);

    expect(linkButtons).toContain('/');
    expect(linkButtons).toContain('/favorites');
  });
});
