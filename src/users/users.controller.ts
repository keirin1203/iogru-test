import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import {UpdateUserDto} from "./dto/update-user.dto";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService){}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers(){
    return this.usersService.getUsers()
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createUser(@Body() dto: CreateUserDto){
    return this.usersService.createUser(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto){
    return this.usersService.updateUser(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string){
    return this.usersService.deleteUser(id)
  }
}
