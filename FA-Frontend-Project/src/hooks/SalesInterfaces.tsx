export interface PartialClient {
  id: number;
  type: string;
  name: string;
}

export interface CompleteClient extends PartialClient {
  address: string;
  phone: string;
  email: string;
  cuit_dni: string;
}