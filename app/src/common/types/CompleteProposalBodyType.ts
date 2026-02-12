import type { AddressType } from "./AddressType";

export interface CompleteProposalBodyType {
  installments: number;
  firstPaymentDate: string;
  customer: {
    email: string;
    dateOfBirth: string;
    address: AddressType;
  };
  consumer?: {
    email: string;
    dateOfBirth: string;
    address: AddressType;
  };
  customerDegreeKinship?: string;
  interestFreeInstallments: boolean;
  debitServiceProportion: number;
}
