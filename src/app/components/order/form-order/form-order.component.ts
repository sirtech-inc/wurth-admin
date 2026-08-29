import { Component, OnInit, ViewChild, Input, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { PedidoService } from '@shared/services/pedido.service';
import { TypeForm } from 'src/app/shared/types/util.types';
import { OrdenDto, OrdenForm, OrderDetailDto } from '@shared/interface/orden.interface';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@shared/services/index.service';
@Component({
  selector: 'app-form-order',
  templateUrl: './form-order.component.html',
  styles: ``
})

export class FormOrderComponent implements OnInit {
  @ViewChild("nav") nav: NgbNav;
  @Input() type: TypeForm;

  public order: OrdenDto
  public orderDetails: OrderDetailDto[] = []
  public form: FormGroup<OrdenForm>;


  public id: number;
  public subtotalCalculado: number = 0;
  public igvCalculado: number = 0;
  public totalCalculado: number = 0;
  public fleteCalculado: number = 0;
  public descuentoCalculado: number = 0;
  public tasaIgv: number = 18;
  public cuponCodigo: string = '';
  public cuponPorcentaje: number | null = null;
  public descuentoEstimado: boolean = false;
  public archivoOc1: string = '';
  public descargandoArchivoOc: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private pedidoservice: PedidoService,
    private notificationService: NotificationService
  ) { }


  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')!);
    this.initValues()
    this.initServices()
  }

  onSave() {
  }

  initValues() {

    this.form = this.formBuilder.group<OrdenForm>({
      numeroOrden: new FormControl(null),
      fechaPedido: new FormControl(null),
      codigoCliente: new FormControl(null),
      razonSocial: new FormControl(null),
      estado: new FormControl(null),
      total: new FormControl(null),
      direccionFiscal: new FormControl(null),
      direccionEntrega: new FormControl(null),
      lugarDestino: new FormControl(null),
      metodoPagoName: new FormControl(null),
      subtotal: new FormControl(null),
      igv: new FormControl(null),
      totalCalculado: new FormControl(null)
    });

  }

  initServices() {
    if (this.id) {
      this.pedidoservice.getOrdersDetalleByCodigoOrden(this.id).subscribe({
        next: (res) => {
          this.form.patchValue({
            codigoCliente: res.codigoCliente ?? "",
            direccionEntrega: res.direccionEntrega ?? "",
            lugarDestino: res.lugarDestino ?? "",
            direccionFiscal: res.direccionFiscal ?? "",
            estado: res.estado ?? "",
            fechaPedido: res.fechaPedido ?? "",
            numeroOrden: res.numeroOrden ?? 0,
            razonSocial: res.razonSocial ?? "",
            metodoPagoName: res.metodoPagoName ?? "",
            total: res.total ?? "",
          })

          this.orderDetails = res.pedidoDetalles

          // El desglose viene del pedido, no se despeja del total.
          //
          // Antes se hacía subtotal = total / 1.18 e IGV = total - subtotal. Eso solo da bien cuando
          // el pedido no tiene envío ni descuento, porque el flete NO está dentro de montototal y un
          // cupón baja el total sin bajar la base. En un pedido con flete de S/ 8.48 sobre un total de
          // S/ 20.29 mostraba subtotal 17.19 e IGV 3.10, cuando los reales son 10.01 y 1.80.
          const totalNumber = parseFloat(res.total ?? '0');

          this.totalCalculado = totalNumber;
          this.subtotalCalculado = Number(res.subtotal ?? 0);
          this.igvCalculado = Number(res.igv ?? 0);
          this.fleteCalculado = Number(res.flete ?? 0);
          this.descuentoCalculado = Number(res.descuento ?? 0);
          this.tasaIgv = Number(res.tasaIgv ?? 18);
          this.cuponCodigo = res.cuponCodigo ?? '';
          this.cuponPorcentaje = res.cuponPorcentaje ?? null;
          this.descuentoEstimado = res.descuentoEstimado ?? false;
          this.archivoOc1 = res.archivoOc1 ?? '';

          this.form.patchValue({
            subtotal: this.subtotalCalculado.toString(),
            igv: this.igvCalculado.toString(),
            totalCalculado: totalNumber.toString()
          });

        }
      })

    }
  }

  descargarArchivoOc() {
    if (!this.archivoOc1 || this.descargandoArchivoOc) return;

    this.descargandoArchivoOc = true;
    this.pedidoservice.downloadArchivoOc(this.archivoOc1).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.archivoOc1;
        link.click();
        window.URL.revokeObjectURL(url);
        this.descargandoArchivoOc = false;
      },
      error: () => {
        this.descargandoArchivoOc = false;
        this.notificationService.showError('No se pudo descargar el archivo adjunto.', 'Aviso');
      }
    });
  }

}
