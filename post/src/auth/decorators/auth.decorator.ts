import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth());
}
