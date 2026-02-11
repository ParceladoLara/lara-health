import type {
	Address,
	Company,
	Patient,
} from "../../../prisma/generated/client";
import { prisma } from "../../database/client";

export type PatientWithRelations = Patient & {
	address: Address;
	company: Company;
};

export class GetPatientService {
	private readonly prisma = prisma;

	public async execute(
		id: number | string,
	): Promise<PatientWithRelations | null> {
		const result = await this.prisma.patient.findFirst({
			where: { id: Number(id) },
			include: { company: true, address: true },
		});

		if (!result) return null;

		return result;
	}
}
