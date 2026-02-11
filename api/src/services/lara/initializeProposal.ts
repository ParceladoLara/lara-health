import type { Patient } from "../../../prisma/generated/client";
import { GetCompanyService } from "../companies/get";
import { PlatformLoginService } from "../gatekeeper/platformLogin";
import { GetPatientService } from "../patients/get";
import { laraClient } from "../../server";
import { GetEmployeeService } from "../employees/get";
import type { InitializeProposalResponseType } from "../../types/InitializeProposalResponseType";
import type { InitializeProposalBodyType } from "../../types/InitializeProposalBodyType";
import { GetAppointmentService } from "../appointments/get";
import { UpdateAppointmentService } from "../appointments/update";

export interface InitializeLaraProposalServiceDTO {
	appointment_id: number;
}

export class InitializeLaraProposalService {
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
		if (!appointment.value) throw new Error("Appointment value not found");
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
		result: InitializeProposalResponseType,
	) {
		if (!result) {
			throw new Error("Result not found");
		}

		const [proposalStatus, proposalId] = [result?.status, result?.id];

		if (proposalStatus && proposalId) {
			await this.updateAppointmentService.execute({
				id: appointment_id,
				lara_proposal_id: proposalId,
				lara_proposal_status: proposalStatus,
			});
		}
	}

	public async execute({
		appointment_id,
	}: InitializeLaraProposalServiceDTO): Promise<InitializeProposalResponseType> {
		const appointment = await this.getAppointment(appointment_id);
		const patient = await this.getPatient(appointment.patient_id);
		const jwt = await this.getJWT(patient);

		const result = await laraClient.request<
			InitializeProposalBodyType,
			InitializeProposalResponseType
		>({
			endpoint: "/proposal",
			method: "POST",
			headers: { Authorization: `Bearer ${jwt}` },
			body: {
				requestedAmount: Number(appointment.value),
				customer: {
					cpf: patient.cpf,
					name: patient.name,
					cellphone: patient.cellphone,
					isSocialName: false,
				},
			},
		});

		await this.updateAppointment(appointment_id, result);

		return result;
	}
}
