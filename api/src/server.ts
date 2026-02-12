import cors from "cors";
import express, { type Express } from "express";
import { LaraAPI } from "./api/laraAPI";
import { AppointmentsRouter } from "./routes/appointments";
import { CompaniesRouter } from "./routes/companies";
import { EmployeesRouter } from "./routes/employees";
import { GatekeeperRouter } from "./routes/gatekeeper";
import { LaraRouter } from "./routes/lara";
import { PatientsRouter } from "./routes/patients";

export const laraClient = new LaraAPI(process.env.LARA_API!);

export class Server {
  private readonly app: Express;
  private readonly port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    this.app.use(new CompaniesRouter().router);
    this.app.use(new EmployeesRouter().router);
    this.app.use(new GatekeeperRouter().router);
    this.app.use(new PatientsRouter().router);
    this.app.use(new AppointmentsRouter().router);
    this.app.use(new LaraRouter().router);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on: http://localhost:${this.port}`);
    });
  }
}

const server = new Server(3000);
server.start();
