import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    console.log(await this.userService.findAll());
    return this.userService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('Request body:', createUserDto);
    return this.userService.create(createUserDto);
  }
}
