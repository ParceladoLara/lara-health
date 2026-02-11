import type { Appointment } from "../../../prisma/generated/client";
import { prisma } from "../../database/client";

export class GetAppointmentService {
	private readonly prisma = prisma;

	public async execute(id: number | string): Promise<Appointment | null> {
		const result = await this.prisma.appointment.findFirst({
			where: {
				id: Number(id),
			},
			include: { patient: true },
		});

		return result;
	}
}
