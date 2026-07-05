import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { Product } from "@shared/interface/product.interface";
import { ProductsData } from "@shared/interface/product.interface";
import { ProductService } from "@shared/services/product.service";
import { ResponseModel } from "@shared/interface";
import { PedidoService } from "@shared/services/pedido.service";

@Component({
  selector: 'app-producto-modal',
  templateUrl: './producto-modal.component.html',
})
export class ProductoModalComponent {
  @ViewChild("productoModal", { static: false }) ProductoModal: TemplateRef<string>;
  @Input() clienteSeleccionado: any;
  public closeResult: string;
  public modalOpen: boolean = false;

  products: Product[] = [];
  selectedProducts: Product[] = []; // <- productos seleccionados
  totalRecords: number = 0;
  loading: boolean = true;

  constructor(
    private modalService: NgbModal,
    private productService: PedidoService,
  ) {}

  ngOnInit() {
    this.loadProducts({ page: 1, size: 10 }); // carga inicial
  }

  loadProducts(payload: any) {
    this.loading = true;
    this.productService.getProducts(payload).subscribe({
      next: (res: ResponseModel<ProductsData>) => {
        this.products = res.datos.datos;
        this.totalRecords = res.datos.count;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  async openModal() {
    this.modalOpen = true;
    this.modalService.open(this.ProductoModal, {
      ariaLabelledBy: 'Media-Modal',
      centered: true,
      windowClass: 'theme-modal modal-xl media-modal'
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  agregarSeleccionados() {
    const codes = this.selectedProducts.map(p => p.code);
    console.log("Códigos seleccionados:", this.selectedProducts);
    console.log("usuario :", this.clienteSeleccionado);
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}
