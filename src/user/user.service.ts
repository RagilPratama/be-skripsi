import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }
    const user = this.userRepository.create(createUserDto);
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async update(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`User with id ${id} not found`);
    }
  }
}
