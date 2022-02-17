import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { config } from "src/config";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: config.PRIVATE_KEY,
      signOptions: {
        expiresIn: '12h'
      }
    })
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {
}