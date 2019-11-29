import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share'

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Api } from '..';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;
  tokenKeyName="IE8CSS3";
  constructor(public api: Api,
              private storage: Storage) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    seq.subscribe((res: any) => {
      console.log('seq',res);

      //res= JSON.parse(res);
      // If the API returned a successful response, mark the user as logged in
      if (res.result == '200') {
        this.loggedIn(res.message);
      } else {
        this.loggedIn(null);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this.loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this.loggedIn(null);
  }

  /**
   * Process a login/signup response to store user data
   */
  loggedIn(userInfo) {
    this._user = userInfo;
    this.storage.set(this.tokenKeyName, this._user);
  }
  getCurrentUser():Promise<any>{
    return this.storage.get(this.tokenKeyName);
  }
}
