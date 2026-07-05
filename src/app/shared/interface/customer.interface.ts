import { Courtesy, CustomeFormControl, OptionalAll, TypePersonCompany } from "../types/util.types";
import { PaginateModel } from "./core.interface";

export interface CustomerModel extends PaginateModel {
    datos: Customer[];
    
}

export interface CustomerData {
    datos: Customer[];
    count: number;
}


export interface Customer {
    code?: number
    name?: string;
    lastname?: string;
    ecommerce?: string;
    email?: string;
    password?: string;
    courtesy?: Courtesy;
    type?: string;
    company_rrss?: string;
    nro_doc?: string;
    address? : Address[];
    bulletin?: boolean;
    eccomerce?: string;

    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    password_confirmation?: string
    document_number?: string,
    customer_code?: number,
    phone?: string,
    company_name?: string,
    division?: string,
    people_using_product?: number,
    deal?: string
    status?: string | boolean | number
}

export interface Address {
    id: number;
    customer_id: number;
    alias: string;
    address: string;
    phone : string;
    reference: string;
    // ubigeo: Ubigeo;
    status: boolean;
}


export interface AddressDto {
  code: number;
  name: string;         // Alias
  address: string;      // Dirección
  urbanization: string;
  district: string;
  reference: string;
  ubigeo: string;
  is_province: boolean;
  has_payment_order: boolean;
  payment_condition: number;
  billing_email: string;
  carrier: number;
  lastname: string | null;
  type: string | null;
  created_at: string | null;
  status: boolean | null;
}


// export interface CustomerRequest {
//   email: string,
//   password: string,
//   password_confirmation: string
//   type: string,
//   document_number: string,
//   customer_code: number,
//   name: string,
//   lastname: string,
//   phone: string,
//   company_name: string,
//   division: string,
//   people_using_product: number,
//   deal: string
//   status: string | boolean | number
// }

export type CustomerForm = CustomeFormControl<OptionalAll<Customer>>
// export type CustomerFormDto = CustomeFormControl<OptionalAll<CustomerRequest>>
