import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdPipe implements PipeTransform<string> {
  transform(value: string): string {
    const isValidObjectId = Types.ObjectId.isValid(value);

    if (!isValidObjectId) {
      throw new BadRequestException(
        `Invalid Object ID: ${value}. Must be a single String of 12 bytes or a string of 24 hex characters`,
      );
    }

    return value;
  }
}
