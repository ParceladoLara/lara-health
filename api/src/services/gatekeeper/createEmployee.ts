import { Employee, PrismaClient } from "@prisma/client";
import { JWTIssuer } from "./builder";

export class SetEmployeeLaraIdService {
  private readonly prisma: PrismaClient;
  private readonly gatekeeperUrl: string;
  private readonly playerApiKey: string;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
    this.gatekeeperUrl = process.env.GATEKEEPER_URL as string;
    this.playerApiKey = process.env.PLAYER_API_KEY as string;
  }

  public async execute(data: Employee, companyKey: string): Promise<string> {
    const issuer = new JWTIssuer();
    const { company_id, lara_id: _id, ...rest } = data;

    const issuerJwt = issuer.build("employee:create");

    const response = await fetch(`${this.gatekeeperUrl}/v1/employee/`, {
      method: "POST",
      headers: {
        client_assertion: issuerJwt,
        client_assertion_key: this.playerApiKey,
        company_key: companyKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rest),
    });

    const json = (await response.json()) as { data: string };
    const laraId = json.data;

    await this.prisma.employee.updateMany({
      where: {
        cpf: data.cpf,
        company_id: company_id,
      },
      data: {
        lara_id: laraId,
      },
    });

    return laraId;
  }
}
