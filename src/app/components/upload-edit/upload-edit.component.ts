import { Input } from '@angular/core';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/models/file-upload.model';
import { FileUploadService } from 'src/app/services/file-upload/file-upload.service';


@Component({
  selector: 'app-upload-edit',
  templateUrl: './upload-edit.component.html',
  styleUrls: ['./upload-edit.component.css']
})
export class UploadEditComponent implements OnInit {
  @Input() fileUpload: FileUpload;
  @Input() flag: any
  constructor(
    @Inject('ICONATTACHFILE') public iconAttachFile: any[],
    private uploadService: FileUploadService) { }

  ngOnInit() {
  }

  getFileExtension(filename: string) {
    const ext = filename.split('.').pop();
    const obj = this.iconAttachFile.filter(row => {
      if (row.type === ext) {
        return true;
      }
    });
    if (obj.length > 0) {
      const icon = obj[0].icon;
      return icon;
    } else {
      return 'fas fa-file fa-2x';
    }
  }

  deleteFileUpload(fileUpload: FileUpload, flag: any): void {
    let coll: string
    switch (flag) {
      case 'forDescription': {
        coll = 'uploadDesciption'
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
    this.uploadService.deleteFile(fileUpload, coll);
  }

}
