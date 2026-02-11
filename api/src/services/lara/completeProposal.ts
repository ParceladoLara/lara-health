import type { Patient } from "../../../prisma/generated/client";
import { laraClient } from "../../server";
import type { CompleteProposalBodyType } from "../../types/CompleteProposalBodyType";
import type { CompleteProposalResponseType } from "../../types/CompleteProposalResponseType";
import { GetAppointmentService } from "../appointments/get";
import { UpdateAppointmentService } from "../appointments/update";
import { GetCompanyService } from "../companies/get";
import { GetEmployeeService } from "../employees/get";
import { PlatformLoginService } from "../gatekeeper/platformLogin";
import { GetPatientService } from "../patients/get";

export interface CompleteLaraProposalServiceDTO {
	appointment_id: number;
	installments: number;
	firstPaymentDate: string;
}

export class CompleteLaraProposalService {
	private readonly patientService = new GetPatientService();
	private readonly employeeService = new GetEmployeeService();
	private readonly companyService = new GetCompanyService();
	private readonly platformLoginService = new PlatformLoginService();
	private readonly appointmentService = new GetAppointmentService();
	private readonly updateAppointmentService = new UpdateAppointmentService();

	private async getEmployee() {
		const employee = await this.employeeService.execute(1);
		if (!employee) throw new Error("Employee not found");
		if (!employee.lara_id) throw new Error("Employee lara_id missing");
		return employee;
	}

	private async getAppointment(appointment_id: number) {
		const appointment = await this.appointmentService.execute(appointment_id);
		if (!appointment) throw new Error("Appointment not found");
		if (!appointment.lara_proposal_id)
			throw new Error("Appointment missing lara_proposal_id");
		if (!appointment.patient_id)
			throw new Error("Appointment missing patient_id");
		return appointment;
	}

	private async getPatient(id: number) {
		const patient = await this.patientService.execute(id);
		if (!patient) throw new Error("Patient not found");
		return patient;
	}

	private async getJWT(patient: Patient) {
		const company = await this.companyService.execute(patient.company_id);
		if (!company?.apiKey) throw new Error("Company API key not found");

		const employee = await this.getEmployee();

		if (!employee?.lara_id) {
			throw Error("LaraId not found");
		}

		return this.platformLoginService.execute(
			{ ssoId: employee.lara_id },
			company.apiKey,
		);
	}

	private async updateAppointment(
		appointment_id: number,
		result: CompleteProposalResponseType,
	) {
		if (!result) {
			throw new Error("Result not found");
		}

		const proposalStatus = result?.status;

		if (proposalStatus) {
			await this.updateAppointmentService.execute({
				id: appointment_id,
				lara_proposal_status: proposalStatus,
			});
		}
	}

	public async execute({
		appointment_id,
		installments,
		firstPaymentDate,
	}: CompleteLaraProposalServiceDTO): Promise<CompleteProposalResponseType> {
		const appointment = await this.getAppointment(appointment_id);
		const patient = await this.getPatient(appointment.patient_id);
		const jwt = await this.getJWT(patient);

		console.log({
			customer: {
				email: patient.email,
				dateOfBirth: patient.dateOfBirth,
				address: {
					...patient.address,
					country: {
						id: 1,
					},
				},
			},
			installments,
			firstPaymentDate,
			debitServiceProportion: 0,
			interestFreeInstallments: false,
		});

		const result = await laraClient.request<
			CompleteProposalBodyType,
			CompleteProposalResponseType
		>({
			endpoint: `/contract/${appointment.lara_proposal_id}`,
			method: "POST",
			headers: { Authorization: `Bearer ${jwt}` },
			body: {
				customer: {
					email: patient.email,
					dateOfBirth: patient.dateOfBirth,
					address: {
						...patient.address,
						number: patient.address.number.toString(),
						country: {
							id: 1,
						},
					},
				},
				installments,
				firstPaymentDate,
				debitServiceProportion: 0,
				interestFreeInstallments: false,
			},
		});

		await this.updateAppointment(appointment_id, result);

		return result;
	}
}
