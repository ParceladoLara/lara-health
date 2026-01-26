import { JWTIssuer } from "./builder";

export interface OnboardingLoginRequest {
  documentNumber: string;
  cellphone?: string;
  contactName?: string;
  companyName?: string;
  email?: string;
}

export class OnboardingLoginService {
  private readonly gatekeeperUrl: string;
  private readonly playerApiKey: string;

  constructor() {
    this.gatekeeperUrl = process.env.GATEKEEPER_URL as string;
    this.playerApiKey = process.env.PLAYER_API_KEY as string;
  }

  public async execute(
    data: OnboardingLoginRequest
  ): Promise<string | undefined> {
    const issuer = new JWTIssuer();

    const issuerJwt = issuer.build("onboarding:login");

    try {
      const response = await fetch(
        `${this.gatekeeperUrl}/v1/onboarding/login`,
        {
          method: "POST",
          headers: {
            client_assertion: issuerJwt,
            client_assertion_key: this.playerApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const json = (await response.json()) as { data: string };

      return json.data;
    } catch (error) {
      console.log(error);
    }
  }
}
