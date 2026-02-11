import type { Company } from "../../../prisma/generated/client";
import { prisma } from "../../database/client";

export class GetCompanyService {
	private readonly prisma = prisma;

	public async execute(id: number | string): Promise<Company | null> {
		const result = await this.prisma.company.findFirst({
			where: {
				id: Number(id),
			},
		});

		return result;
	}
}
