import type { Appointment } from "../../../prisma/generated/client";
import { prisma } from "../../database/client";

export class ListAppointmentsService {
	private readonly prisma = prisma;

	public async execute(): Promise<Appointment[]> {
		const response = await this.prisma.appointment.findMany({
			include: { patient: true },
		});

		return response;
	}
}
