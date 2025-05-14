import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import { FastifyReply } from "fastify";

import { EditMessageUseCase } from "core/application/usecases/edit-message.usecase";
import { FollowUserUseCase } from "core/application/usecases/follow-user.usecase";
import {
  PostMessageCommand,
  PostMessageUseCase,
} from "core/application/usecases/post-message.usecase";
import { ViewTimelineUseCase } from "core/application/usecases/view-timeline.usecase";
import { ViewWallUseCase } from "core/application/usecases/view-wall.usecase";
import { ApiTimeLinePresenter } from "./timeline.presenter";

@Controller()
export class ApiController {
  constructor(
    private readonly postMessageUseCase: PostMessageUseCase,
    private readonly editMessageUseCase: EditMessageUseCase,
    private readonly followUserUseCase: FollowUserUseCase,
    private readonly viewTimelineUseCase: ViewTimelineUseCase,
    private readonly viewWallUseCase: ViewWallUseCase,
  ) {}

  @Post("/post")
  async postMessage(@Body() body: { user: string; message: string }) {
    const postMessageCommand: PostMessageCommand = {
      id: randomUUID(),
      text: body.message,
      author: body.user,
    };
    try {
      await this.postMessageUseCase.handle(postMessageCommand);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post("/edit")
  async editMessage(@Body() body: { messageId: string; message: string }) {
    try {
      await this.editMessageUseCase.handle({
        text: body.message,
        messageId: body.messageId,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post("/follow")
  async followUser(@Body() body: { user: string; followed: string }) {
    try {
      await this.followUserUseCase.handle({
        user: body.user,
        userToFollow: body.followed,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post("/view")
  async viewTimeline(@Body() body: { user: string }, @Res() res: FastifyReply) {
    const presenter = new ApiTimeLinePresenter(res);
    await this.viewTimelineUseCase.handle({ user: body.user }, presenter);
  }

  @Post("/wall")
  async viewWall(@Body() body: { user: string }, @Res() res: FastifyReply) {
    const presenter = new ApiTimeLinePresenter(res);
    await this.viewWallUseCase.handle(body.user, presenter);
  }
}
