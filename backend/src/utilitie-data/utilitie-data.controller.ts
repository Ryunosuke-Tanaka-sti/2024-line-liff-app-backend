import { Body, ConflictException, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RequestCreateDto } from './dto/request.dto';
import { ResponseAllType, ResponseIndividualType } from './dto/response.dto';
import { UtilitieDataService } from './utilitie-data.service';

@Controller('/api/utilities')
export class UtilitieDataController {
  constructor(private readonly service: UtilitieDataService) {}

  // 全てのリスト
  @Get()
  async getAllData(): Promise<ResponseAllType> {
    return this.service.getAllData();
  }

  // 所属のリスト
  @Get('sl')
  async getAllDataSL(): Promise<ResponseIndividualType[]> {
    return this.service.getIndividualAllData('sl');
  }
  @Post('sl')
  async createSLData(@Body() request: RequestCreateDto): Promise<void> {
    const isExistData = await this.service.isExistDataByName('sl', request.displayName);
    if (isExistData) throw new ConflictException('Data Already Exist');
    return this.service.createUtilitieData('sl', { displayName: request.displayName });
  }
  @Put('sl/:uid')
  async updateSLData(@Param('uid') uid: string, @Body() request: RequestCreateDto): Promise<void> {
    const isExistData = await this.service.isExistDataByUid('sl', uid);
    if (!isExistData) throw new ConflictException('Data Not Exist');
    return this.service.updateSlData('sl', { uid, displayName: request.displayName });
  }
  @Delete('sl/:uid')
  async deleteSLData(@Param('uid') uid: string): Promise<void> {
    const isExistData = await this.service.isExistDataByUid('sl', uid);
    if (!isExistData) throw new ConflictException('Data Not Exist');
    return this.service.deleteSlData('sl', uid);
  }

  //スキルのリスト
  @Get('skill')
  async getAllDataSkill(): Promise<ResponseIndividualType[]> {
    return this.service.getIndividualAllData('skill');
  }
  @Post('skill')
  async createSkillData(@Body() request: RequestCreateDto): Promise<void> {
    const isExistData = await this.service.isExistDataByName('skill', request.displayName);
    if (isExistData) throw new ConflictException('Data Already Exist');
    return this.service.createUtilitieData('skill', { displayName: request.displayName });
  }
  @Put('skill/:uid')
  async updateSkillData(@Param('uid') uid: string, @Body() request: RequestCreateDto): Promise<void> {
    const isExistData = await this.service.isExistDataByUid('skill', uid);
    if (!isExistData) throw new ConflictException('Data Not Exist');
    return this.service.updateSlData('skill', { uid, displayName: request.displayName });
  }
  @Delete('skill/:uid')
  async deleteSkillData(@Param('uid') uid: string): Promise<void> {
    const isExistData = await this.service.isExistDataByUid('skill', uid);
    if (!isExistData) throw new ConflictException('Data Not Exist');
    return this.service.deleteSlData('skill', uid);
  }

  // 資格のリスト
  @Get('qualification')
  async getAllDataQuantification(): Promise<ResponseIndividualType[]> {
    return this.service.getIndividualAllData('qualification');
  }
  @Post('qualification')
  async createQualificationData(@Body() request: RequestCreateDto): Promise<void> {
    const isExistData = await this.service.isExistDataByName('qualification', request.displayName);
    if (isExistData) throw new ConflictException('Data Already Exist');
    return this.service.createUtilitieData('qualification', { displayName: request.displayName });
  }
  @Put('qualification/:uid')
  async updateQualificationData(@Param('uid') uid: string, @Body() request: RequestCreateDto): Promise<void> {
    const isExistData = await this.service.isExistDataByUid('qualification', uid);
    if (!isExistData) throw new ConflictException('Data Not Exist');
    return this.service.updateSlData('qualification', { uid, displayName: request.displayName });
  }
  @Delete('qualification/:uid')
  async deleteQualificationData(@Param('uid') uid: string): Promise<void> {
    const isExistData = await this.service.isExistDataByUid('qualification', uid);
    if (!isExistData) throw new ConflictException('Data Not Exist');
    return this.service.deleteSlData('qualification', uid);
  }

  //管理している対象のリスト
  @Get('manager')
  async getAllDataManager(): Promise<ResponseIndividualType[]> {
    return this.service.getIndividualAllData('manager');
  }
  @Post('manager')
  async createManagerData(@Body() request: RequestCreateDto): Promise<void> {
    const isExistData = await this.service.isExistDataByName('manager', request.displayName);
    if (isExistData) throw new ConflictException('Data Already Exist');
    return this.service.createUtilitieData('manager', { displayName: request.displayName });
  }
  @Put('manager/:uid')
  async updateManagerData(@Param('uid') uid: string, @Body() request: RequestCreateDto): Promise<void> {
    const isExistData = await this.service.isExistDataByUid('manager', uid);
    if (!isExistData) throw new ConflictException('Data Not Exist');
    return this.service.updateSlData('manager', { uid, displayName: request.displayName });
  }
  @Delete('manager/:uid')
  async deleteManagerData(@Param('uid') uid: string): Promise<void> {
    const isExistData = await this.service.isExistDataByUid('manager', uid);
    if (!isExistData) throw new ConflictException('Data Not Exist');
    return this.service.deleteSlData('manager', uid);
  }
}
