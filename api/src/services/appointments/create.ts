import type { Appointment } from "../../../prisma/generated/client";
import { prisma } from "../../database/client";

export interface CreateAppointmentDTO
	extends Omit<Appointment, "id" | "value"> {}

export class CreateAppointmentService {
	private readonly prisma = prisma;

	public async execute(data: CreateAppointmentDTO) {
		const result = await this.prisma.appointment.create({
			data: {
				patient: {
					connect: {
						id: data.patient_id,
					},
				},
				value: 0,
			},
		});

		return result;
	}
}
