import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase'
import { Subject } from 'rxjs';

@Injectable()
export class MessagingService {

  private messaging = firebase.messaging()

  private messageSource = new Subject()
  currentMessage = this.messageSource.asObservable()

  constructor(
    private afs: AngularFirestore
  ) { }

  getPermission(user) {
    this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission grandted.');
        return this.messaging.getToken();
      })
      .then(token => this.saveToken(user, token))
      .catch(err => console.log(err, 'Unable to get permission'));
  }

  monitorRefresh(user) {
    this.messaging.onTokenRefresh(() => {
      this.messaging.getToken()
        .then(refreshedToken => this.saveToken(user, refreshedToken))
        .catch(err => console.log(err, 'Unable to retrieve new token'))
    })
  }

  receiveMessages() {
    this.messaging.onMessage(payload => {
      console.log('Message received. ', payload);
      this.messageSource.next(payload)
    })
  }

  private saveToken(user, token): void {
    const currentTokens = user.fmcTokens || {}
    console.log(currentTokens, token);

    if (!currentTokens[token]) {
      const userRef = this.afs.collection('users').doc(user.uid)
      const tokens = { ...currentTokens, [token]: true }
      userRef.update({ fcmTokens: tokens })
    }
  }

}
