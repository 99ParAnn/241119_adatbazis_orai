import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Konyv } from './konyv';
import { ujKonyvDTO } from './uj-konyv.dto';
import { UpdateKonyvDTO } from './update-konyv.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  konyvek: Konyv[] = [
    {
      id: 0,
      title: "Hobbit",
      author: "Tolkien",
      isbn: "idk",
      publishYear: 42,
      reserved: true
    },

    {
      id: 1,
      title: "LoTR: Fellowship of the Ring",
      author: "Tolkien",
      isbn: "idk2",
      publishYear: 1954,
      reserved: false
    },
    {
      id: 2,
      title: "Dune",
      author: "Frank Herbert",
      isbn: "idk3",
      publishYear: 1965,
      reserved: true
    }
  ]
  nextID = 3;
  @Get('konyvek')
  konyvListazas() {
    return this.konyvek;
  }


  @Get('konyvek/:konyvid')
  konvyvIDalapjan(@Param('konyvid') id: string) {
    const idSzam = parseInt(id);
    const konyv = this.konyvek.find(konyv => konyv.id == idSzam);
    if (!konyv) {
      throw new NotFoundException("ID wrong")
    }
    return konyv;
  }

  @Delete('konyvek/:konyvid')
  @HttpCode(204)
  konyvTorles(@Param('konyvid') id: string){
    const idSzam = parseInt(id);
    const konyvIndex = this.konyvek.findIndex(konyv => konyv.id == idSzam);
    if (konyvIndex == -1) {
      throw new NotFoundException("ID wrong")
    }
    this.konyvek.splice(konyvIndex,1);
  }
  @Post('konyvek')
  @HttpCode(201)
  ujKonyv(@Body() ujKonyvAdatok: ujKonyvDTO){
    const ujKonyv: Konyv = {
      id:this.nextID,
      ...ujKonyvAdatok,
      reserved:false
    }
    this.nextID++;
    this.konyvek.push(ujKonyv);
    return ujKonyv;
  }

  @Patch('konyvek/:konyvid')
  @HttpCode(200)
  patchKonyv(@Body() reszlegesKonyvAdatok: UpdateKonyvDTO,
  @Param('konyvid') id: string){
    const idSzam = parseInt(id);
    const regiKonyvIndex = this.konyvek.findIndex (konyv => konyv.id == idSzam);    
    const ujKonyv: Konyv = {
      ...this.konyvek[regiKonyvIndex],
      ...reszlegesKonyvAdatok
    }
    this.konyvek[regiKonyvIndex] = ujKonyv;
    return ujKonyv;
  }


}
