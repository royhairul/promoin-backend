import { IsOptional, IsString } from 'class-validator';

export class CreateProfileDTO {
  @IsString()
  bio?: string;

  @IsString()
  slug?: string;

  @IsString()
  theme_color?: string;

  @IsString()
  @IsOptional()
  template?: string;

  @IsString()
  @IsOptional()
  cta_link?: string;

  @IsString()
  name?: string;

  @IsOptional()
  user_id: string;

  @IsOptional()
  logo: any;
}

export class UpdateProfileSiteDTO {
  @IsString()
  cta_text: string;

  @IsString()
  cta_link: string;

  @IsString()
  template: string;

  @IsOptional()
  user_id: string;
}

export class UpdateProfileDTO {
  bio?: string;
  slug?: string;
  logo?: string;
  theme_color?: string;
  template?: string;
  cta_link?: string;
  user_id?: string;
}
