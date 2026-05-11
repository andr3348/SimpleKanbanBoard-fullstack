import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import axios from 'axios';

@Controller('unsplash')
@UseGuards(JwtAuthGuard)
export class UnsplashController {
  @Get('search')
  async search(@Query('query') query: string) {
    const { data } = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, per_page: 12, orientation: 'landscape' },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    return data.results.map((photo: any) => ({
      id: photo.id,
      thumbUrl: photo.urls.small,
      coverUrl: photo.urls.regular,
      author: photo.user.name,
      authorUrl: photo.user.links.html,
    }));
  }
}
