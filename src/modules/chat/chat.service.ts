import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { GetDirectMessagesRes } from '@libs/dto';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDirectMessages(
    staffId: string,
    memberId: string,
  ): Promise<GetDirectMessagesRes> {
    const member = await this.prismaService.member.findUnique({
      where: { id: memberId },
    });
    if (!member) {
      throw new BadRequestException('Member not found');
    }
    const messages = await this.prismaService.message.findMany({
      where: {
        OR: [
          {
            senderId: staffId,
            receiverId: memberId,
          },
          {
            senderId: memberId,
            receiverId: staffId,
          },
        ],
      },
    });

    return { member, messages };
  }
}
