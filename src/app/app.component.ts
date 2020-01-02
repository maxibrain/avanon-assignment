import { Component, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { StockService, Stock } from './stock.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private readonly stocks$ = new BehaviorSubject<Stock[]>(JSON.parse(localStorage.getItem('stocks') || '[]'));
  readonly displayedColumns = ['symbol', 'price', 'size', 'time', 'tools'];
  readonly stocksDataSource$ = this.stocks$.pipe(
    map(stocks => {
      const ds = new MatTableDataSource(stocks);
      ds.sort = this.sort;
      return ds;
    })
  );

  constructor(private stockService: StockService, private snackBar: MatSnackBar) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private setStocks(stocks: Stock[]) {
    localStorage.setItem('stocks', JSON.stringify(stocks));
    this.stocks$.next(stocks);
  }

  search(text: string) {
    this.stockService.getPrice([text]).subscribe(
      stocks => this.setStocks([...stocks, ...this.stocks$.value]),
      err =>
        this.snackBar.open(err.message, null, {
          duration: 2000
        })
    );
  }

  remove(stock: Stock) {
    this.setStocks(this.stocks$.value.filter(s => s !== stock));
  }
}
