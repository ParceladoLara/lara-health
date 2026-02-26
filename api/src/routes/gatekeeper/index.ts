import { Router } from "express";
import { GatekeeperController } from "../../controllers/gatekeeper/Login";

export class GatekeeperRouter {
	public readonly router: Router;
	private controller: GatekeeperController;

	constructor() {
		this.router = Router();
		this.controller = new GatekeeperController();
		this.setupRoutes();
	}

	private setupRoutes(): void {
		// Use o bind para não perder o contexto do 'this'
		this.router.post("/login", (req, res) => this.controller.gatekeeperLogin(req, res));
	}
}