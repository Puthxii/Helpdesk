import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from 'src/app/models/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private basePath = `/uploads`;

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore) { }

  pushFileToStorage(fileUpload: FileUpload, flag): Observable<number> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          fileUpload.url = downloadURL;
          fileUpload.name = fileUpload.file.name;
          let coll: string
          switch (flag) {
            case 'forDescription': {
              coll = 'uploadDesciption'
              break
            }
            case 'forResolveDescription': {
              coll = 'uploadResolveDescription'
              break
            }
          }
          this.saveFile(fileUpload, coll);
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  private async saveFile(fileUpload: FileUpload, collection: any) {
    try {
      await this.afs.collection(collection).add({
        url: fileUpload.url,
        name: fileUpload.name,
      })
    } catch (error) {
      console.log(error);
    }
  }

  getFiles(collection: any) {
    return this.afs.collection(collection);
  }

  deleteFile(fileUpload: FileUpload, flag: any): void {
    let coll: string
    switch (flag) {
      case 'forDescription': {
        coll = 'uploadDesciption'
        break
      }
      case 'forResolveDescription': {
        coll = 'uploadResolveDescription'
        break
      }
    }
    this.deleteFileFireStore(fileUpload.id, coll)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileFireStore(id: string, coll: any): Promise<void> {
    return this.afs.collection(coll).doc(id).delete();
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}
