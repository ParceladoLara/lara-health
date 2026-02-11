import type { Patient } from "../../../prisma/generated/client";
import { prisma } from "../../database/client";

export class ListPatientsService {
	private readonly prisma = prisma;

	public async execute(): Promise<Patient[]> {
		const response = await this.prisma.patient.findMany({
			include: { company: true, address: true },
		});

		return response;
	}
}
