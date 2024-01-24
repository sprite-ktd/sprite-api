import { Member as UserType } from '@prisma/client';
import { Request } from 'express';

export interface RequestWithMember extends Request {
  member: UserType;
}
