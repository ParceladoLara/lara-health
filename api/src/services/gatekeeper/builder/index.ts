import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export class JWTIssuer {
	private readonly privateKey: string;
	private readonly apiKey: string;
	private readonly expirationSeconds: number;

	private readonly jwtHeader = {
		alg: "RS256",
		typ: "JWT",
	};

	constructor() {
		this.privateKey = process.env.PLAYER_PRIVATE_KEY as string;
		this.apiKey = process.env.PLAYER_API_KEY as string;
		this.expirationSeconds = Number(process.env.JWT_EXPIRATION_TIME);
	}

	public build(jwtAud: string): string {
		const now = Math.floor(Date.now() / 1000);

		const jwtClaim = {
			jti: uuidv4(),
			sub: this.apiKey,
			iss: this.apiKey,
			iat: now,
			nbf: now,
			exp: now + this.expirationSeconds,
			aud: jwtAud,
		};


		return jwt.sign(jwtClaim, this.privateKey, {
			algorithm: "RS256",
			header: this.jwtHeader,
		});
	}
}
