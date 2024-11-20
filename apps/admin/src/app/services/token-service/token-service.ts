import { Injectable, inject, signal } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '@auth0/auth0-angular';

/**
 * Interface representing token data structure
 */
interface TokenData {
   /** The raw JWT token string */
   token: string | null;
   /** The decoded token payload */
   decodedToken: unknown | null;
}

/**
 * Service for managing authentication tokens and permissions
 *
 * @description
 * Handles JWT token management including:
 * - Retrieving and storing tokens
 * - Decoding token payloads
 * - Managing user permissions
 * - Tracking loading and error states
 */
@Injectable({
   providedIn: 'root'
})
export class TokenService {
   private auth = inject(AuthService);
   private jwtHelper = inject(JwtHelperService);
   private tokenData = signal<TokenData>({ token: null, decodedToken: null });

   public error = signal<string | null>(null);
   public isLoading = signal(true);
   public permissions = signal<string[]>([]);

   constructor() {
      this.error.set(null);
      this.isLoading.set(true);

      this.auth.getAccessTokenSilently().subscribe({
         next: (token) => {
            if (token) {
               try {
                  const decodedToken = this.jwtHelper.decodeToken(token);
                  this.tokenData.set({ token, decodedToken });
                  this.permissions.set(decodedToken.permissions || []);
               } catch (error) {
                  this.error.set(`Failed to decode token: ${error}`);
               }
            } else {
               this.error.set('No token received');
            }
            this.isLoading.set(false);
         },
         error: (error) => {
            console.error('Error getting token:', error);
            this.error.set(`Failed to load permissions: ${error}`);
            this.isLoading.set(false);
         }
      });
   }

   /**
    * Gets the current raw JWT token
    *
    * @returns The JWT token string or null if not available
    */
   public get(): string | null {
      return this.tokenData().token;
   }

   /**
    * Gets the decoded token payload
    *
    * @returns The decoded token data or null if not available
    */
   public getDecodedToken(): unknown | null {
      return this.tokenData().decodedToken;
   }

   /**
    * Checks if user has a specific permission
    *
    * @param permission - The permission to check for
    * @returns True if the user has the permission, false otherwise
    */
   public hasPermission(permission: string): boolean {
      return this.permissions().includes(permission);
   }

   /**
    * Checks if user has all specified permissions
    *
    * @param permissions - Array of permissions to check for
    * @returns True if the user has all permissions, false otherwise
    */
   public hasAllPermissions(permissions: string[]): boolean {
      return permissions.every((permission) => this.hasPermission(permission));
   }
}
