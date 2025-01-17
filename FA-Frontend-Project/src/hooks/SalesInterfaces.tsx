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