import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthUserDto} from "./dto/authUser.dto";
import {AuthGuard} from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthUserDto){
    return this.authService.signup(dto)
  }

  @Post('signin')
  signin(@Body() dto: AuthUserDto){
    return this.authService.signin(dto)
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  refresh(@Req() req: Request){
    const user = req['user']
    return this.authService.refresh(user.username, user.refreshToken)
  }
}
