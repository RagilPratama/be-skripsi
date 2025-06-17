import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello API Skripsi!';
  }

  getMyFirstString(id?: string): string {
    if (id) {
      return `First String with id: ${id}`;
    }
    return `ID From param: ${id}`;
  }
}
