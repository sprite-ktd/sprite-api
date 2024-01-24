import { NOTIFICATION_SERVICE } from '@libs/microservices';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import configurations from './config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/database/database.module';
import { MemberModule } from './modules/member/member.module';
import { ChatModule } from './modules/chat/chat.module';

const modules = [PrismaModule, AuthModule, MemberModule, ChatModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
    }),

    ...modules,
  ],
  providers: [
    {
      provide: NOTIFICATION_SERVICE,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: 3010,
          },
        });
      },
    },
  ],
})
export class AppModule {}
