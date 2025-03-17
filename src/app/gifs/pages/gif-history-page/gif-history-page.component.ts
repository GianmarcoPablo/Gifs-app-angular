import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from "@angular/core/rxjs-interop"
import { map } from 'rxjs';
import { GifsService } from '../../services/gifs.service';
import { GifsListComponent } from "../../components/gifs-list/gifs-list.component";

@Component({
  selector: 'gif-history',
  imports: [GifsListComponent],
  templateUrl: './gif-history-page.component.html',
})
export class GifHistoryComponent {

  gifsService = inject(GifsService)

  query = toSignal(inject(ActivatedRoute).params.pipe(
    map(params => params["query"] ?? "no query")
  ))

  gifsByKey = computed(() => this.gifsService.getHistoryGifs(this.query()))
}
