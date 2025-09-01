import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class CreateLinkDTO {
  platform: string;
  url: string;
}

export class UpdateLinkDTO {
  platform?: string;
  url?: string;
}

export class CreateLinksDTO {
  @ValidateNested({ each: true })
  @Type(() => CreateLinkDTO)
  links: CreateLinkDTO[];
}
