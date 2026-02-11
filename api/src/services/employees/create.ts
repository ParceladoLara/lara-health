import { prisma } from "../../database/client";

export interface CreateEmployeeDTO {
	name: string;
	cellphone: string;
	cpf: string;
	birthDate: string;
	companyId: number;
	laraId?: string;
}

export class CreateEmployeeService {
	private readonly prisma = prisma;

	public async execute(data: CreateEmployeeDTO) {
		const employee = await this.prisma.employee.create({
			data: {
				name: data.name,
				cellphone: data.cellphone,
				cpf: data.cpf,
				dateOfBirth: data.birthDate,
				company: {
					connect: { id: data.companyId },
				},
				lara_id: data?.laraId ?? null,
			},
		});

		return employee;
	}
}
