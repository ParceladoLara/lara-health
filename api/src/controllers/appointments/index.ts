import type { Request, Response } from "express";
import {
  CreateAppointmentDTO,
  CreateAppointmentService,
} from "../../services/appointments/create";
import { GetAppointmentService } from "../../services/appointments/get";
import { ListAppointmentsService } from "../../services/appointments/list";
import {
  UpdateAppointmentValueDTO,
  UpdateAppointmentValueService,
} from "../../services/appointments/updateValue";

export class AppointmentController {
  private readonly createService = new CreateAppointmentService();
  private readonly getService = new GetAppointmentService();
  private readonly listService = new ListAppointmentsService();
  private readonly updateValueService = new UpdateAppointmentValueService();

  public create = async (req: Request, res: Response): Promise<Response> => {
    const data: CreateAppointmentDTO = req.body;

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

  public updateValue = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const data: UpdateAppointmentValueDTO = req.body;

    try {
      const employees = await this.updateValueService.execute(data);
      return res.status(200).json(employees);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
}
