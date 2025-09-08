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

export interface CreateClientDTO {
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  cuitDni: string;
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

export interface CreateBudgetDTO {
  discount: number;
  client?: CreateClientDTO;
  clientId?: number;
  products: Array<ProductBudget>;
  total: number;
}

export interface ProductBudget {
  id: number;
  productName: string;
  productMeasurePrice: number;
  measureUnitQuantity: number;
  saleUnitQuantity: number;
  discountPercentage: number;
  subtotal: number;
  productSaleUnit: string;
  productMeasureUnit: string;
  saleUnitPrice: number;
}

export interface PartialBudget {
  id: number;
  clientName: string | null;
  status: BudgetStatus;
  finalAmount: number;
  date: string;
  discount: number;
}

export interface CompleteBudget extends PartialBudget {
  clientId: number | null;
  products: Array<ProductBudget>;
  stockDecreased: boolean;
}

export interface BudgetReport {
  month: string;
  PENDIENTE: number;
  PAGO: number;
  ENVIADO: number;
  ENTREGADO: number;
  CANCELADO: number;
}

export interface createCashRegisterRecordDTO {
  date: string;
  amount: number;
  type: string;
  detail: string;
}

export interface RegisterRecord extends createCashRegisterRecordDTO {
  id: number;
}
