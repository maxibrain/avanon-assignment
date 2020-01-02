import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { StockService, Stock } from './stock.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private stockService: StockService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('removeConfirmationDialog', { static: true, read: TemplateRef }) removeConfirmationDialog: TemplateRef<any>;

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
    this.dialog.open(this.removeConfirmationDialog, { data: stock }).afterClosed().subscribe(result => {
      if (result) {
        this.setStocks(this.stocks$.value.filter(s => s !== stock));
      }
    });
  }
}
