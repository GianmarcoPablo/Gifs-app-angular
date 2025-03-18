import { AfterViewInit, Component, ElementRef, inject, viewChild } from "@angular/core";
import { GifsService } from "../../services/gifs.service";
import { ScrollStateService } from "src/app/shared/services/scroll-state.service";


@Component({
    selector: "gif-dashboard-page",
    templateUrl: "./trending-page.component.html"
})
export class TrendingPageComponent implements AfterViewInit {

    gifsService = inject(GifsService)
    scrollService = inject(ScrollStateService)

    scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');


    ngAfterViewInit(): void {
        const scrollDiv = this.scrollDivRef()?.nativeElement;
        if (!scrollDiv) return;

        scrollDiv.scrollTop = this.scrollService.trendingScrollState()
    }

    onScroll(event: Event) {
        const scrollDiv = this.scrollDivRef()?.nativeElement;
        if (!scrollDiv) return;

        const scrollTop = scrollDiv.scrollTop;
        const clientHeight = scrollDiv.clientHeight;
        const scrollHeight = scrollDiv.scrollHeight;

        const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
        this.scrollService.trendingScrollState.set(scrollTop)

        if (isAtBottom) {
            this.gifsService.loadTrendingGifs();
        }
    }
}