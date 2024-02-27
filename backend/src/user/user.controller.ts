import { Body, Controller, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GoogleIdTokenVerifyGrantIdGuard } from 'src/common/guard/google-id-token-verify-grant-id/google-id-token-verify-grant-id.guard';
import {
  RequestCreateDto,
  RequestUpdateDto,
  RequestUpdateManagerDto,
  RequestUpdatePersonalInfoDto,
  RequestUpdateQuantificationDto,
  RequestUpdatesSkillDto,
} from './dto/request.dto';
import { ResponseUserDto } from './dto/response.dto';
import { UserService } from './user.service';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(GoogleIdTokenVerifyGrantIdGuard)
  async getUserMe(@Body() request: { uid: string }): Promise<ResponseUserDto> {
    const isExistUser = await this.userService.isExistUser(request.uid);
    if (!isExistUser) throw new NotFoundException();
    return this.userService.getUser(request.uid);
  }

  @Post('/')
  @UseGuards(GoogleIdTokenVerifyGrantIdGuard)
  async createUser(@Body() request: RequestCreateDto): Promise<void> {
    return this.userService.createUser(request);
  }

  @Put('/')
  @UseGuards(GoogleIdTokenVerifyGrantIdGuard)
  async updateUser(@Body() request: RequestUpdateDto): Promise<void> {
    const isExistUser = await this.userService.isExistUser(request.uid);
    if (!isExistUser) throw new NotFoundException();
    return this.userService.updateUser(request);
  }
  @Put('/personalInfo')
  @UseGuards(GoogleIdTokenVerifyGrantIdGuard)
  async updatePersonalInfo(@Body() request: RequestUpdatePersonalInfoDto): Promise<void> {
    const isExistUser = await this.userService.isExistUser(request.uid);
    if (!isExistUser) throw new NotFoundException();
    return this.userService.updatePersonalInfo(request);
  }

  @Put('/skills')
  @UseGuards(GoogleIdTokenVerifyGrantIdGuard)
  async updateSkills(@Body() request: RequestUpdatesSkillDto): Promise<void> {
    const isExistUser = await this.userService.isExistUser(request.uid);
    if (!isExistUser) throw new NotFoundException();
    return this.userService.updateSkills(request);
  }
  @Put('/qualification')
  @UseGuards(GoogleIdTokenVerifyGrantIdGuard)
  async updateQualification(@Body() request: RequestUpdateQuantificationDto): Promise<void> {
    const isExistUser = await this.userService.isExistUser(request.uid);
    if (!isExistUser) throw new NotFoundException();
    return this.userService.updateQualification(request);
  }

  @Put('/manager')
  @UseGuards(GoogleIdTokenVerifyGrantIdGuard)
  async updateManager(@Body() request: RequestUpdateManagerDto): Promise<void> {
    const isExistUser = await this.userService.isExistUser(request.uid);
    if (!isExistUser) throw new NotFoundException();
    return this.userService.updateManager(request);
  }

  @Get('/:uid')
  @UseGuards(GoogleIdTokenVerifyGrantIdGuard)
  async getUser(@Param('uid') uid: string): Promise<ResponseUserDto> {
    const isExistUser = await this.userService.isExistUser(uid);
    if (!isExistUser) throw new NotFoundException();
    return this.userService.getUser(uid);
  }
}
