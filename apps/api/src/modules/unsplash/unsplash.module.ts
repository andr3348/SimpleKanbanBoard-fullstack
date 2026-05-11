import { Module } from '@nestjs/common';
import { UnsplashController } from './unsplash.controller';

@Module({
  imports: [],
  controllers: [UnsplashController],
  providers: [],
  exports: [],
})
export class UnsplashModule {}
