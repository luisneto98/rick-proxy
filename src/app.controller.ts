import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';
import { identity } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(
    @Query('page') page: number, 
    @Query('limit') limit: number,
    @Query('filter') filter: string
  ) {
    const { data } = await axios.get('https://rickandmortyapi.com/api/character');
    
    const results = data.results.filter(ch => ch.name.includes(filter || ''));

    const count = results.length;
    const pages = Math.ceil(count/limit);

    const init = 0 + (page -1) * limit;
    const end = 0 + limit * page;

    console.log({
      count,
      pages,
      init,
      end
    })

    const newResult = results.slice(init, end);
    const newInfo = {
      pages,
      count,
    }

    return { 
      info: newInfo,
      results: newResult 
    };
  }

  @Get('/:id')
  async getOne(
    // @Query('page') page: number, 
    // @Query('limit') limit: number,
    // @Query('filter') filter: string
    @Param('id') id: number,
  ) {
    const { data } = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
    return data;
  }

  @Get('episode/:id')
  async getEpisodes(
    // @Query('page') page: number, 
    // @Query('limit') limit: number,
    // @Query('filter') filter: string
    @Param('id') id: number,
  ) {
    const { data } = await axios.get(`https://rickandmortyapi.com/api/character/${id}`);
    const { episode } = data
    const episodeIds = episode.map(ep => ep.split('episode/')[1])
    const { data: episodes } = await axios.get(`https://rickandmortyapi.com/api/episode/${episodeIds.join(',')}`);
    return episodes;
  }
}
