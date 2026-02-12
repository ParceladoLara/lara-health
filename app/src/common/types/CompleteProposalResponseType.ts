import type { ProposalCustomer } from "./ProposalCustomer";
import { ProposalStatus } from "./ProposalStatus";

export interface CompleteProposalResponseType {
  id: number;
  approvedAmount: string;
  finalRequestedAmount: string;
  expiresAt: string;
  firstPaymentDate: string;
  status: ProposalStatus;
  requestedAmount: string;
  installments: number;
  createdAt: string;
  updatedAt: string;
  customer: ProposalCustomer;
  consumer: ProposalCustomer;
  customerInterestRate: string;
}
