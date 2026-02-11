import type { Request, Response } from "express";
import { prisma } from "../../database/client";
import { GetEmployeeService } from "../../services/employees/get";
import { SetEmployeeLaraIdService } from "../../services/gatekeeper/createEmployee";
import { OnboardingLoginService } from "../../services/gatekeeper/onboardingLogin";
import { PlatformLoginService } from "../../services/gatekeeper/platformLogin";

interface CompanyType {
	id: number;
	cnpj: string;
	name: string;
	apiKey: string | null;
}

export class GatekeeperController {
	private readonly prisma = prisma;
	private readonly getEmployeeService: GetEmployeeService;
	private readonly setEmployeeLaraIdService: SetEmployeeLaraIdService;
	private readonly onboardingLoginService: OnboardingLoginService;
	private readonly platformLoginService: PlatformLoginService;

	constructor() {
		this.getEmployeeService = new GetEmployeeService();
		this.setEmployeeLaraIdService = new SetEmployeeLaraIdService();
		this.onboardingLoginService = new OnboardingLoginService();
		this.platformLoginService = new PlatformLoginService();
	}

	public async gatekeeperLogin(req: Request, res: Response): Promise<Response> {
		const {
			ssoId,
			documentNumber,
			cellphone,
			companyName,
			contactName,
			email,
		} = req.body;

		if (!ssoId && !documentNumber) {
			return res.status(400).json({ error: "Invalid parameters" });
		}

		// 🔹 Busca a company com Prisma
		const company = (await this.prisma.company.findUnique({
			where: { cnpj: documentNumber },
		})) as CompanyType | null;

		if (!company) {
			return res.status(404).json({ error: "Company not found" });
		}

		// 🔹 Se não tem apiKey → redireciona para onboarding
		if (!company?.apiKey) {
			const jwt = await this.onboardingLoginService.execute({
				documentNumber,
				cellphone,
				companyName,
				contactName,
				email,
			});

			return res.status(200).json({
				url: `${process.env.ONBOARDING_URL}?credential=${jwt}`,
			});
		}

		// 🔹 Busca o employee pelo ssoId
		const employee = await this.getEmployeeService.execute(ssoId);

		if (!employee) {
			return res.status(404).json({ error: "Employee not found" });
		}

		// 🔹 Se ainda não tem laraId → registra no Gatekeeper
		if (!employee?.lara_id) {
			await this.setEmployeeLaraIdService.execute(employee, company.apiKey);
		}

		if (!employee?.lara_id) {
			return res.status(404).json({ error: "laraId not found" });
		}

		// 🔹 Gera o token da Platform
		const jwt = await this.platformLoginService.execute(
			{ ssoId: employee.lara_id },
			company.apiKey,
		);

		return res.status(200).json({
			url: `${process.env.PLATFORM_URL}?credential=${jwt}`,
		});
	}
}
