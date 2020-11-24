import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import {environment} from '../../environments/environment';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable(
    {providedIn: 'root'}
)
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    constructor(private http: HttpClient, private router: Router){}

    signUp(email: string, password: string): Observable<any> {
        return this.http
        .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {
            email: email,
            password: password,
            returnSecureToken: true
        })
        .pipe(
            catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(responseData.email,
                    responseData.localId,
                    responseData.idToken,
                    +responseData.expiresIn
                );
            })
        );
    }

    login(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>
        ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(
            catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(responseData.email,
                    responseData.localId,
                    responseData.idToken,
                    +responseData.expiresIn
                );
            })
        );
    }

    autoLogin(): void {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpireDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData){
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token,
            new Date(userData._tokenExpireDate));
            // we call the getter now
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpireDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number): void{
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    logout(): void{
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number): void {
        const expireDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expireDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = '';
        if (!error.error || !error.error.error){
                return throwError(errorMessage);
            }
        switch (error.error.error.message){
                case 'EMAIL_EXISTS': errorMessage = 'This email exists already';
                                     break;
                case 'EMAIL_NOT_FOUND': errorMessage = 'There is no user record corresponding to this identifier.';
                                        break;
                case 'INVALID_PASSWORD': errorMessage = 'The password is invalid or the user does not have a password';
                                         break;
                case 'USER_DISABLED' : errorMessage = 'The user account has been disabled by an administrator';
                                       break;
                default: errorMessage = 'An error occured';
              }
        return throwError(errorMessage);
    }
}
