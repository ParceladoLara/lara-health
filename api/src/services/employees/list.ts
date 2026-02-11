import type { Employee } from "../../../prisma/generated/client";
import { prisma } from "../../database/client";

export class ListEmployeesService {
	private readonly prisma = prisma;

	public async execute(): Promise<Employee[]> {
		const employees = await this.prisma.employee.findMany({
			include: { company: true },
		});

		return employees;
	}
}
