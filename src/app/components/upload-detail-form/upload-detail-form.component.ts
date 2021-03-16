import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/models/file-upload.model';
import { FileUploadService } from 'src/app/services/file-upload/file-upload.service';
import { Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { Input } from '@angular/core';
@Component({
  selector: 'app-upload-detail-form',
  templateUrl: './upload-detail-form.component.html',
  styleUrls: ['./upload-detail-form.component.css']
})
export class UploadDetailFormComponent implements OnInit {
  @Input() flag: any
  @Output() editeUpload = new EventEmitter<any>();
  fileUploads: any[];
  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  percentage: number;

  constructor(private uploadService: FileUploadService) { }

  ngOnInit() {
    this.getFile(this.flag)
  }

  getFile(flag: string) {
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

  selectFile(event: { target: { files: FileList; }; }): void {
    this.selectedFiles = event.target.files;
    this.upload()
  }

  upload(): void {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;
    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload, this.flag).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
      },
      error => {
        console.log(error);
      }
    );
  }

  public OnUpload(fileUploads: any[]) {
    if (fileUploads.length !== 0) {
      this.editeUpload.emit(fileUploads)
    }
  }
}
