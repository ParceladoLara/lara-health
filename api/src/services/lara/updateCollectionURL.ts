import { prisma } from "../../database/client";
export interface UpdateCollectionURLDTO {
	lara_proposal_id: string;
	collection_url: string;
}

export class UpdateCollectionURLService {
	private readonly prisma = prisma;

	public async execute(data: UpdateCollectionURLDTO) {
		const { lara_proposal_id, collection_url } = data;

		const appointment = await this.prisma.appointment.findFirst({
			where: { lara_proposal_id },
			include: {
				patient: true,
			},
		});

		if (!appointment) {
			throw new Error("Appointment not found");
		}

		const patient = appointment.patient_id;

		if (!patient) {
			throw new Error("Patient not found");
		}

		const response = await this.prisma.patient.update({
			where: { id: patient },
			data: {
				collection_url,
			},
		});

		return response;
	}
}
