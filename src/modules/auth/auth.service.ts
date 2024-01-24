import { faker } from '@faker-js/faker';
import { AuthSchema, ConfirmationSchema } from '@libs/schemas';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async signIn(signInDto: AuthSchema) {
    const { email } = signInDto;

    const code = faker.finance.accountNumber({ length: 6 });

    let member = await this.prismaService.member.findUnique({
      where: { email },
    });

    if (!member) {
      member = await this.prismaService.member.create({
        data: { email, displayName: faker.animal.bird() },
      });
    }

    const confirmation = await this.prismaService.emailConfirmation.upsert({
      create: { code, email },
      update: { code },
      where: { email },
    });

    return confirmation.code;
  }

  async confirmEmail(data: ConfirmationSchema) {
    const { code, confirmEmail } = data;

    const member = await this.prismaService.member.findUnique({
      where: { email: confirmEmail },
    });

    if (!member) {
      throw new BadRequestException('Invalid email');
    }

    const confirmation = await this.prismaService.emailConfirmation.findFirst({
      where: { code, email: confirmEmail },
    });

    if (!confirmation) {
      throw new BadRequestException('Invalid code');
    }

    await this.prismaService.emailConfirmation.delete({
      where: { email: confirmEmail },
    });

    const token = await this.jwtService.signAsync(member);

    return { member, token };
  }
}
