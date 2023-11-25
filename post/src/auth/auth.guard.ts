import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Your OpenID service

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      return false;
    }

    try {
      const userInfo = await this.authService.validateToken(token);
      request.user = userInfo; // Add user info to request
      return true;
    } catch (error) {
      return false;
    }
  }

  private extractToken(request): string | null {
    const authHeader = request.headers.authorization;

    // Check if the Authorization header is present and formatted correctly
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      return token;
    }

    return null;
  }
}
