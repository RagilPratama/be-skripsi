import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/first')
  getMyFirstStringNoId(): string {
    return this.appService.getMyFirstString();
  }

  @Get('/first/:id')
  getMyFirstStringWithId(@Param('id') id?: string): string {
    return this.appService.getMyFirstString(id);
  }
}
