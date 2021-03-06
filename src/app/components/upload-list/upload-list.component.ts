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
  fileUploads: any[];

  constructor(private uploadService: FileUploadService) { }

  ngOnInit() {
    this.uploadService.getFiles().snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as FileUpload;
        const id = a.payload.doc['id'];
        return { id, ...data };
      }))
    ).subscribe(fileUploads => {
      this.fileUploads = fileUploads;
    });
  }

}
