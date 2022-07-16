import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import 'dotenv/config'
import {MongooseModule} from "@nestjs/mongoose";
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
