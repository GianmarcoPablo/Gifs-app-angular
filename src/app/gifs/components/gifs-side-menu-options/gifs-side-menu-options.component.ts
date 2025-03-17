import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GifsService } from '../../services/gifs.service';

interface MenuOption {
  label: string;
  subLabel: string;
  route: string;
  icon: string
}

@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './gifs-side-menu-options.component.html',
})
export class GifsSideMenuOptionsComponent {

  gifsService = inject(GifsService)

 
  menuOptions: MenuOption[] = [
    {
      icon: "fa-solid fa-chart-line",
      label: "Trending",
      subLabel: "Gifs Poupulares",
      route: "/dashboard/trending"
    },

    {
      icon: "fa-solid fa-magnifyin-glass",
      label: "Buscador",
      subLabel: "Buscar gifs",
      route: "/dashboard/search"
    },

  ]
}
