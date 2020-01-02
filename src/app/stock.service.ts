import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stock {
  symbol: string;
  price: number;
  size: number;
  time: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private http: HttpClient) {}

  getPrice(symbols: string[]): Observable<Stock[]> {
    return this.http.get<Stock[]>(
      'https://api.iextrading.com/1.0/tops/last',
      { params: { symbols: symbols.join(',') } }
    );
  }
}
