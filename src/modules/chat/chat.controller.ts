import { Controller, Get, Param, Req } from '@nestjs/common';
import { RequestWithMember } from 'src/types/express';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('direct/:memberId')
  async getDirectMessages(
    @Param('memberId') memberId: string,
    @Req() req: RequestWithMember,
  ) {
    return this.chatService.getDirectMessages(req.member.id, memberId);
  }
}
