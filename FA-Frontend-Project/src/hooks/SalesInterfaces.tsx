export interface PartialClient {
  id: number;
  type: string;
  name: string;
}

export interface CompleteClient extends PartialClient {
  address: string;
  phone: string;
  email: string;
  cuitDni: string;
}

export interface AddClient {
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  cuit_dni: string;
}

export interface ClientsFilter {
  keyword: string;
  type: string;
}

export enum BudgetStatus {
  PENDIENTE = "PENDIENTE",
  PAGO = "PAGO",
  ENVIADO = "ENVIADO",
  ENTREGADO = "ENTREGADO",
  CANCELADO = "CANCELADO",
}

export interface PartialBudget {
  id: number;
  clientName: string;
  status: BudgetStatus;
  finalAmount: number;
  date: string;
}

export interface ProductBudget {
  id: number;
  productCode: string;
  productIdentification: string; // Provider + name
  productQuality: string;
  productMeasures: string;
  productMeasurePrice: number;
  measureUnitQuantity: number;
  saleUnitQuantity: number;
  subtotal: number;
  productSaleUnit: string;
  productMeasureUnit: string;
  saleUnitPrice: number;
}

export interface CompleteBudget extends PartialBudget {
  clientId: number;
  products: Array<ProductBudget>;
}
