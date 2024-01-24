import { RECEIVE_MESSAGE, SEND_MESSAGE } from '@libs/events';
import { SendMessageSchema, sendMessageSchema } from '@libs/schemas/chat';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ZodValidationPipe } from 'src/common/zod.pipe';
import { PrismaService } from '../database/database.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly prismaService: PrismaService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody(new ZodValidationPipe(sendMessageSchema))
    data: SendMessageSchema,
  ) {
    const { input: content, senderId, receiverId } = data;

    const message = await this.prismaService.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });

    this.server.sockets.emit(
      RECEIVE_MESSAGE + [senderId, receiverId].sort().join(),
      message,
    );
  }
}
