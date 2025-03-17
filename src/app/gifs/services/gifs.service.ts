import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "@environments/environment";
import type { GiphyRresponse } from "../interfaces/giphy.interface";
import { Gif } from "../interfaces/gif.interface";
import { GifMapper } from "../mapper/gif.mapper";
import { map, tap } from "rxjs";


function loadFromLocalStorage() {
    const gifsFromlocalStorage = localStorage.getItem("gifs") ?? "{}"
    const gifs = JSON.parse(gifsFromlocalStorage)
    return gifs
}

@Injectable({ providedIn: "root" })
export class GifsService {

    private http = inject(HttpClient)

    trendingGfis = signal<Gif[]>([])
    trendingGifsLoading = signal<boolean>(true)

    searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage())
    searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

    constructor() {
        this.loadTrendingGifs()
        console.log("Singleton")
    }

    saveGifsToLocalStorage = effect(() => {
        const historyString = JSON.stringify(this.searchHistory())
        localStorage.setItem("gifs", historyString)
    })

    loadTrendingGifs() {
        this.http.get<GiphyRresponse>(`${environment.giphyUrl}/gifs/trending`, {
            params: {
                api_key: environment.giphyApiKey,
                limit: 20
            }
        }).subscribe((resp) => {
            const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data)
            this.trendingGfis.set(gifs)
            this.trendingGifsLoading.set(false)
        })
    }

    searchGifs(query: string) {
        return this.http.get<GiphyRresponse>(`${environment.giphyUrl}/gifs/search`, {
            params: {
                api_key: environment.giphyApiKey,
                limit: 20,
                q: query
            }
        }).pipe(
            map(({ data }) => data),
            map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
            tap((items) => {
                this.searchHistory.update(history => ({
                    ...history,
                    [query.toLocaleLowerCase()]: items
                }))
            })
        );
    }

    getHistoryGifs(query: string) {
        return this.searchHistory()[query] ?? []
    }
}