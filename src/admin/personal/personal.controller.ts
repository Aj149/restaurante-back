import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { PersonalService } from './personal.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';

@Controller('personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

   @UsePipes(ValidationPipe)
   @Get()
   async getPersonal() {
     return this.personalService.getPersonal();
   }
   
   @UsePipes(ValidationPipe)
   @Get(':id')
   async getPersonalId(@Param('id') id: number) {
     return this.personalService.buscarPersonalId(id);
   }

  @Post()
  async createPersonal(@Body() createPersonalDto: CreatePersonalDto) {
    return this.personalService.createPersonal(createPersonalDto);
  }

  @Patch(':id')
  async updatePersonal(@Param('id') id: number, @Body() updatePersonalDto: UpdatePersonalDto) {
    return this.personalService.updatePersonal(+id, updatePersonalDto);
  }

  @UsePipes(ValidationPipe) 
  @Delete(':id')
  async deletePersonal(@Param('id') id: number) {
    return this.personalService.deletePersonal(+id);
  }
}
