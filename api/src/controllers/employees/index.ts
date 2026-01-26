import type { Request, Response } from "express";
import {
  type CreateEmployeeDTO,
  CreateEmployeeService,
} from "../../services/employees/create";
import { GetEmployeeService } from "../../services/employees/get";
import { ListEmployeesService } from "../../services/employees/list";

export class EmployeeController {
  private readonly createEmployeeService = new CreateEmployeeService();
  private readonly getEmployeeService = new GetEmployeeService();
  private readonly listEmployeesService = new ListEmployeesService();

  public createEmployee = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const data: CreateEmployeeDTO = req.body;

    try {
      const employee = await this.createEmployeeService.execute(data);
      return res.status(201).json(employee);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  public getEmployee = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const { search } = req.params;

    try {
      const employee = await this.getEmployeeService.execute(search as string);
      return res.status(200).json(employee);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };

  public listEmployees = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const employees = await this.listEmployeesService.execute();
      return res.status(200).json(employees);
    } catch (error) {
      return res.status(500).json({ error });
    }
  };
}
