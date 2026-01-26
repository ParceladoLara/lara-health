import type { Request, Response } from "express";
import {
  CreatePatientDTO,
  CreatePatientService,
} from "../../services/patients/create";
import { GetPatientService } from "../../services/patients/get";
import { ListPatientsService } from "../../services/patients/list";

export class PatientController {
  private readonly createService = new CreatePatientService();
  private readonly getService = new GetPatientService();
  private readonly listService = new ListPatientsService();

  public create = async (req: Request, res: Response): Promise<Response> => {
    const data: CreatePatientDTO = req.body;

    try {
      const employee = await this.createService.execute(data);
      return res.status(201).json(employee);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  public get = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
      const employee = await this.getService.execute(id as string);
      return res.status(200).json(employee);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  public list = async (req: Request, res: Response): Promise<Response> => {
    try {
      const employees = await this.listService.execute();
      return res.status(200).json(employees);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
}
