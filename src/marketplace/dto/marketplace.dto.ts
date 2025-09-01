import { IsOptional, IsString } from 'class-validator';

export class CreateMarketplaceDTO {
  @IsString()
  url: string;

  @IsString()
  sort_by: string;

  @IsOptional()
  user_id;
}
