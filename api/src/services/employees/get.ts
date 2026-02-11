import type { Employee, Prisma } from "../../../prisma/generated/client";
import { prisma } from "../../database/client";
import type { CreateEmployeeDTO } from "./create";

export interface GetEmployeeDTO extends CreateEmployeeDTO {
	id: number;
	laraId?: string;
}

export class GetEmployeeService {
	private readonly prisma = prisma;

	public async execute(query: number | string): Promise<Employee | null> {
		let filter: Prisma.EmployeeFindFirstArgs;

		if (!isNaN(Number(query))) {
			filter = {
				where: { id: Number(query) },
			};
		} else {
			filter = {
				where: { lara_id: query.toString() },
			};
		}

		const employee = await this.prisma.employee.findFirst({
			...filter,
			include: { company: true },
		});

		return employee;
	}
}
