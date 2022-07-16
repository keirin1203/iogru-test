import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./user.schema";
import {Model} from "mongoose";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async getUsers(): Promise<User[]>{
    return this.userModel.find()
  }

  async createUser(dto: CreateUserDto): Promise<User>{
    const user = new this.userModel(dto)
    return user.save()
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User>{
    return this.userModel.findByIdAndUpdate(
      id,
      dto,
      {new: true}
    )
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndRemove(id)
  }

  async getUserByUsername(username: string): Promise<User>{
    return this.userModel.findOne({
      username: username,
    })
  }

  async updateToken(username: string, newToken: string){
    return this.userModel.findOneAndUpdate({
      username: username
    },{
      hashedRefreshToken: newToken
    })
  }
}
