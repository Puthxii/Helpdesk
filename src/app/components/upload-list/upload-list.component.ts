import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { FileUpload } from 'src/app/models/file-upload.model';
import { FileUploadService } from 'src/app/services/file-upload/file-upload.service';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.css']
})
export class UploadListComponent implements OnInit {
  @Input() flag: any
  @Output() upload = new EventEmitter<any>();
  fileUploads: any[];

  constructor(private uploadService: FileUploadService) { }
  ngOnInit() {
    this.getFile(this.flag)
  }

  getFile(flag: string) {
    let coll: string
    switch (flag) {
      case 'forDescription': {
        coll = 'uploadDescription'
        break
      }
      case 'forResponseDescription': {
        coll = 'uploadResponseDescription'
        break
      }
    }
    this.getByCollection(coll)
  }

  getByCollection(coll: any) {
    this.uploadService.getFiles(coll).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as FileUpload;
        const id = a.payload.doc['id'];
        return { id, ...data };
      }))
    ).subscribe(fileUploads => {
      this.fileUploads = fileUploads;
      this.OnUpload(this.fileUploads)
    });
  }

  public OnUpload(fileUploads: any[]) {
    this.upload.emit(fileUploads);
  }

}
