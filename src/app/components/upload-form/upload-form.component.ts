import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/models/file-upload.model';
import { FileUploadService } from 'src/app/services/file-upload/file-upload.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {
  @Input() flag: any
  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  percentage: number;
  constructor(private uploadService: FileUploadService) { }

  ngOnInit() {
  }

  selectFile(event: { target: { files: FileList; }; }): void {
    this.selectedFiles = event.target.files;
    this.upload()
  }

  upload(): void {
    let coll: string
    switch (this.flag) {
      case 'forDescription': {
        coll = 'uploadDescription'
        break
      }
      case 'forResponseDescription': {
        coll = 'uploadResponseDescription'
        break
      }
      case 'forMaDescription': {
        coll = 'uploadMaDescription'
        break
      }
      case 'forSuggestDescription': {
        coll = 'uploadSuggestDescription'
        break
      }
      case 'forResolveDescription': {
        coll = 'uploadResolveDescription'
        break
      }
    }
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;
    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload, coll).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
        setTimeout(() => {
          this.currentFileUpload = null;
        }, 2000);
      },
      error => {
        console.log(error);
      }
    );
  }

}
