import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';

@Injectable()
export class MemberService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCurrentMemberContact() {
    const contacts = await this.prismaService.member.findMany();

    return contacts;
  }

  async getMemberById(id: string) {
    return this.prismaService.member.findUnique({ where: { id } });
  }
}
