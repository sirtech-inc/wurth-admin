import { OptionalAll, OrdenFormControl } from "@shared/types/util.types";

export interface OrdenDto {
  numeroOrden?: number,
  fechaPedido?: string,
  codigoCliente?: string,
  razonSocial?: string,
  estado?: string,
  total?: string,
  direccionFiscal?: string,
  direccionEntrega?: string,
  lugarDestino?: string,
  subtotal?: string,
  igv?: string,
  totalCalculado?: string
}

export type OrdenForm = OrdenFormControl<OptionalAll<OrdenDto>>



export interface OrderDetailDto {
  codigoProducto: string;
  codigoPedidoDetalle: string;
  cantidadTotalProducto: string;
  descuentoMaximoProducto: string;
  precioUnitarioProducto: string;
  subTotalProducto: string;
  nameProducto: string;
}

export interface OrderPedidoDto extends OrdenDto {
  pedidoDetalles: OrderDetailDto[]
}