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
  totalCalculado?: string,
  metodoPagoName?: string,
  archivoOc1?: string
}

export type OrdenForm = OrdenFormControl<OptionalAll<OrdenDto>>



export interface OrderDetailDto {
  codigoProducto: string;
  codigoPedidoDetalle: string;
  cantidadTotalProducto: string;
  descuentoProducto: string;
  descuentoMaximoProducto: string;
  precioUnitarioProducto: string;
  subTotalProducto: string;
  nameProducto: string;
}

export interface OrderPedidoDto extends OrdenDto {
  pedidoDetalles: OrderDetailDto[]
  // El endpoint /Order/pedido/{id} ya devuelve el desglose real: no hay que despejarlo del total.
  // `subtotal` e `igv` los hereda de OrdenDto, donde están declarados como string porque también
  // son slots del formulario; del API llegan como número, por eso se leen con Number().
  tasaIgv?: number           // la tasa, 18
  flete?: number             // envío; no está incluido en el subtotal
  descuento?: number         // lo que descontó el cupón
  cuponCodigo?: string       // referencia del cupón, si quedó registrado
  descuentoEstimado?: boolean // true si se despejó del total en vez de venir de un registro
}