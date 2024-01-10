import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Product } from './product';
import { ProductsService } from '../services/products.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../common-components/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements AfterViewInit {

  //Variables and table columns declarations
  products: Product[] = [];
  displayedColumns: string[] = ['title', 'description', 'status','date', 'category', 'actions']; // Add more column names as needed
  dataSource!: MatTableDataSource<Product>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductsService,
              private router: Router,
              private dialog: MatDialog,
              private _snackBar : MatSnackBar) {}

  ngOnInit(): void {
    this.refreshTable();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  /**
   * Function - refreshTable()
   * Use - To refresh and get the latest data based on user actions
   * Developed By : WeblineIndia
   */
  refreshTable(): void {
    this.products = this.productService.getAllProducts();
    this.dataSource = new MatTableDataSource(this.products);
    this.dataSource.paginator = this.paginator;
  }


  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLTextAreaElement).value?.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Function - addProduct()
   * Use - To navigate user on the Add Product Page
   * Developed By : WeblineIndia
   */
  addProduct(){
    this.router.navigate(['/products/add-product'])
  }

  /**
   * Function - editProduct()
   * @param productId
   * Use - To navigate user on the Edit Product Page with the Product ID
   * Developed By : WeblineIndia
   */
  editProduct(productId: Product): void {
    this.router.navigate(['/products/edit-product/'+productId.id])
  }

  /**
   * Function - deleteProduct()
   * @param productId
   * Use - To delete a product based on the product id
   * Developed By : WeblineIndia
   */
  deleteProduct(productId: Product): void {

    //Confirmation Dialog to ask for user Confirmation
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this product?'
      }
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        // User confirmed deletion
        this.productService.deleteProduct(productId.id);
        this.refreshTable();
        this._snackBar.open('Product Deleted Successfully !!', 'Success', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });


  }
}
