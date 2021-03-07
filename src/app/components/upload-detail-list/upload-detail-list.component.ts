import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/models/file-upload.model';

@Component({
  selector: 'app-upload-detail-list',
  templateUrl: './upload-detail-list.component.html',
  styleUrls: ['./upload-detail-list.component.css']
})
export class UploadDetailListComponent implements OnInit {
  @Input() fileUpload: FileUpload;

  constructor() { }

  ngOnInit() {
  }

}
