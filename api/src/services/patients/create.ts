import type { Patient } from "../../../prisma/generated/client";
import { prisma } from "../../database/client";

export interface CreatePatientDTO
	extends Omit<
		Patient,
		"address_id" | "id" | "collection_url" | "company_id"
	> {}

export class CreatePatientService {
	private readonly prisma = prisma;

	public async execute(data: CreatePatientDTO) {
		const result = await this.prisma.patient.create({
			data: {
				name: data.name,
				cellphone: data.cellphone,
				cpf: data.cpf,
				dateOfBirth: data.dateOfBirth,
				email: data.email,
				collection_url: null,
				company: {
					connect: { id: 1 },
				},
				address: {
					connect: { id: 1 },
				},
			},
		});

		return result;
	}
}
