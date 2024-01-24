import { AuthSchema, ConfirmationSchema } from '@libs/schemas';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: AuthSchema) {
    return this.authService.signIn(signInDto);
  }

  @Post('confirm')
  async confirm(@Body() data: ConfirmationSchema) {
    return this.authService.confirmEmail(data);
  }
}
