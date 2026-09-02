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
  // % real de la promocion propia del producto (precio-final o escala), antes del prorrateo del
  // cupon. null en pedidos anteriores a este campo o en lineas sin promocion propia.
  descuentoPromocionProducto?: string | null;
  descuentoMaximoProducto: string;
  precioUnitarioProducto: string;
  // Precio de lista SIN ningun descuento (ni promocion propia ni cupon), solo informativo. null en
  // pedidos anteriores a este campo: ahi se cae a precioUnitarioProducto para mostrar algo.
  precioListaProducto?: string | null;
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
  cuponPorcentaje?: number   // porcentaje del cupón (ej. 10 para 10%); null si es de monto fijo
  descuentoEstimado?: boolean // true si se despejó del total en vez de venir de un registro
}