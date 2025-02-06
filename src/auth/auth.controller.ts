import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  NotImplementedException,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { PassportLocalGuard } from './guards/passport-local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  createUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createUser(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  @UseGuards(PassportLocalGuard) // 로그인 요청이 들어오면 PassportLocalGuard 가 실행됨 -> local.strategy.ts 검증 -> request.user 에 유저 정보가 담김
  login(@Request() request) {
    return this.authService.signIn(request.user);
  }

  // @UseGuards(AuthGuard)
  // @Get('me')
  // getUserInfo(@Request() request) {
  //   if (!request.user) {
  //     throw new NotImplementedException();
  //   }
  //   return request.user;
  // }
}
