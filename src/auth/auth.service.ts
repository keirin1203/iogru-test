import {ForbiddenException, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import * as bcrypt from "bcrypt";
import {AuthUserDto} from "./dto/authUser.dto";
import {JwtService} from "@nestjs/jwt";
import "dotenv/config"

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async signup(dto: AuthUserDto){
    const hashPassword = await bcrypt.hash(dto.password, 10)

    const newUser = await this.userService.createUser({
      username: dto.username,
      password: hashPassword,
    })

    const tokens = await this.getTokens(newUser.username)
    await this.updateRefreshTokenHash(newUser.username, tokens.refreshToken)
    return tokens
  }

  async signin(dto: AuthUserDto){
    const user = await this.userService.getUserByUsername(dto.username)
    if (!user) throw new ForbiddenException("Access Denied")

    const passwordMatches = await bcrypt.compare(dto.password, user.password)
    if (!passwordMatches) throw new ForbiddenException("Access Denied")

    const tokens = await this.getTokens(user.username)
    await this.updateRefreshTokenHash(user.username, tokens.refreshToken)
    return tokens
  }

  async refresh(username: string, refreshToken: string){
    const user = await this.userService.getUserByUsername(username)
    if (!user) throw new ForbiddenException("Access Denied")

    const refreshTokensMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken)
    if (!refreshTokensMatches) throw new ForbiddenException("Access Denied")

    const tokens = await this.getTokens(user.username)
    await this.updateRefreshTokenHash(user.username, tokens.refreshToken)
    return tokens
  }

  async updateRefreshTokenHash(username: string, refreshToken: string){
    const newhash = await bcrypt.hash(refreshToken, 10)

    await this.userService.updateToken(username, newhash)
  }

  async getTokens(username: string){
    const accessToken = await this.jwtService.signAsync({
      username: username
    },{
      secret: process.env.SECRET_KEY,
      expiresIn: '20s'
    })

    const refreshToken = await this.jwtService.signAsync({
      username: username
    },{
      secret: process.env.SECRET_KEY,
      expiresIn: '30d'
    })

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    }
  }

}
