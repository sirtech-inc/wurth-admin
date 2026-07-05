import { Component, OnInit, ViewChild, Input, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { PedidoService } from '@shared/services/pedido.service';
import { TypeForm } from 'src/app/shared/types/util.types';
import { OrdenDto, OrdenForm, OrderDetailDto } from '@shared/interface/orden.interface';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private pedidoservice: PedidoService
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
            total: res.total ?? "",
          })

          this.orderDetails = res.pedidoDetalles

          const totalNumber = parseFloat(res.total ?? '0');
          const subtotalNumber = totalNumber / 1.18;
          const igvNumber = totalNumber - subtotalNumber;

          this.totalCalculado = totalNumber;
          this.subtotalCalculado = subtotalNumber;
          this.igvCalculado = igvNumber;

          this.form.patchValue({
            subtotal: subtotalNumber.toString(),
            igv: igvNumber.toString(),
            totalCalculado: totalNumber.toString()
          });

        }
      })

    }
  }

}
