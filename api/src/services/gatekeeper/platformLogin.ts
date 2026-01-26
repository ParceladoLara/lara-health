import { JWTIssuer } from "./builder";

export interface PlatformLoginProps {
  ssoId: string;
}

export class PlatformLoginService {
  private readonly gatekeeperUrl: string;
  private readonly playerApiKey: string;

  constructor() {
    this.gatekeeperUrl = process.env.GATEKEEPER_URL as string;
    this.playerApiKey = process.env.PLAYER_API_KEY as string;
  }

  public async execute(
    data: PlatformLoginProps,
    companyKey: string
  ): Promise<string> {
    const issuer = new JWTIssuer();

    const issuerJwt = issuer.build("caas:login");

    const response = await fetch(`${this.gatekeeperUrl}/v1/caas/login`, {
      method: "POST",
      headers: {
        client_assertion: issuerJwt,
        client_assertion_key: this.playerApiKey,
        company_key: companyKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = (await response.json()) as { data: string };

    return json.data;
  }
}
