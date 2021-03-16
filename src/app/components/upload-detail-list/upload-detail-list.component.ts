import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/models/file-upload.model';

@Component({
  selector: 'app-upload-detail-list',
  templateUrl: './upload-detail-list.component.html',
  styleUrls: ['./upload-detail-list.component.css']
})
export class UploadDetailListComponent implements OnInit {
  @Input() flag: any
  @Input() fileUpload: FileUpload;
  @Output() fileRemove = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }

  public onFileRemove(value: any): void {
    this.fileRemove.emit(value);
  }
}
