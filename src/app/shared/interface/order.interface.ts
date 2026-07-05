import { TypeStatus } from "@shared/types/util.types";
import { PaginateModel } from "./core.interface";

export interface OrderModel extends PaginateModel {
    datos: Order[];
}

export interface OrdersData {
    datos: Order[];
    count: number;
}

export interface Order {
    numeroOrden: number,
    fechaPedido: string
    codigoCliente: string
    razonSocial: string
    direccionFiscal: string
    direccionEntrega: string
    estado: string
    total: string
}

export interface OrderProducts {
    file_url: string;
    name:string;
    price:number;
    quantity : number;
    subtotal : number;
}

export interface OrderCustomer{
    name :string;
    email:string;
}
export interface OrderCustomerAddress{
    phone:string;
    address:string;
    reference:string;
    city:string;
    ubigeo: string;
}

export interface OrderToSelect {
    code: number;
    name: string;
    reference: string;
    status: TypeStatus
}

export interface DashboardModelInterfacer {
    datos: PedidoModel[],
    total: number,
    countUsuarioNuevos: string,
    totalPedidos: string,
    ingresostotales: string
}

export interface PedidoModel {
  numeroOrden?: number;
  fechaPedido?: string;
  codigoCliente?: string;
  razonSocial?: string;
  direccionFiscal?: string;
  direccionEntrega?: string;
  estado?: string;
  total?: string;
}

export interface Estadisticas {
  pedido?: PedidoModel[];
  ingresostotales?: string;
  countUsuarioNuevos?: string;
  totalPedidos?: string;
}
