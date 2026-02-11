import type { Appointment } from "../../../prisma/generated/client";
import { prisma } from "../../database/client";

export interface UpdateAppointmentValueDTO
	extends Omit<Appointment, "patient_id"> {}

export class UpdateAppointmentValueService {
	private readonly prisma = prisma;

	public async execute(data: UpdateAppointmentValueDTO) {
		const result = await this.prisma.appointment.update({
			where: {
				id: data.id,
			},
			data: {
				value: Number(data.value),
			},
		});

		return result;
	}
}
