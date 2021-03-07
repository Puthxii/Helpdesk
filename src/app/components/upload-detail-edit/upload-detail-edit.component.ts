import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Inject } from '@angular/core';
import { FileUpload } from 'src/app/models/file-upload.model';

@Component({
  selector: 'app-upload-detail-edit',
  templateUrl: './upload-detail-edit.component.html',
  styleUrls: ['./upload-detail-edit.component.css']
})
export class UploadDetailEditComponent implements OnInit {
  @Input() fileUpload: FileUpload;

  constructor(
    @Inject('ICONATTACHFILE') public iconAttachFile: any[],
  ) { }

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

}

