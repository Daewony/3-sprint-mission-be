import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
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

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshAccessToken(
    @Request() request: { headers: { authorization?: string } },
  ) {
    const authorization = request.headers.authorization;
    console.log('authorization', authorization);
    const refreshToken: string = authorization
      ? authorization.split(' ')[1]
      : ''; // Bearer 제거
    console.log('refreshToken', refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    return this.authService.refreshAccessToken(refreshToken);
  }
}
