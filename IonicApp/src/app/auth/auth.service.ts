import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UserLogin, UserRegister } from './user';
import { AuthResponse } from './auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_SERVER_ADDRESS = 'http://localhost:3000';
  authSubject = new BehaviorSubject(false);

  constructor(
    private nativeStorage: NativeStorage,
    private httpClient: HttpClient,
    public alertController: AlertController
  ) {}

  register(user: UserRegister): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/api/users`, user)
      .pipe(
        tap(async (res: AuthResponse) => {
          if (res.token) {
            this.nativeStorage
              .setItem('token', res.token)
              .then(() => console.log('Token saved!'))
              .catch(err => {
                this.presentAlert(err);
              });
          }
        })
      );
  }

  login(user: UserLogin): Observable<AuthResponse> {
    return this.httpClient
      .post(`${this.AUTH_SERVER_ADDRESS}/api/auth`, user)
      .pipe(
        tap(async (res: AuthResponse) => {
          if (res.token) {
            this.nativeStorage
              .setItem('token', res.token)
              .then(() => console.log('Token saved!'))
              .catch(err => {
                this.presentAlert(err);
              });
          }
        })
      );
  }
  async logout() {
    this.nativeStorage.remove('token');
    this.authSubject.next(false);
  }
  isLoggedIn() {
    return this.authSubject.asObservable();
  }
  async presentAlert(err: any) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Register',
      message: err.message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
