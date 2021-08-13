import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Server } from 'src/app/models/site.model';
import { SiteService } from 'src/app/services/site/site.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-site-serve',
  templateUrl: './site-serve.component.html',
  styleUrls: ['./site-serve.component.css']
})
export class SiteServeComponent implements OnInit {
  @Input() id: string
  serverForm: FormGroup;
  isAdd = true;
  isEdit = false;
  Server: Server[];
  detailConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: false,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ],
  };
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ],
  };
  ServerType = ['Database Server', 'Remote Server', 'Web Server']
  isShow = false;
  serverDetails: any;
  constructor(
    private fb: FormBuilder,
    private siteService: SiteService
  ) { }

  ngOnInit() {
    this.buildForm()
    this.getServer()
    if (this.isAdd) {
      this.addUserLogin()
    }
  }

  getServer() {
    this.siteService.getServer(this.id).snapshotChanges().subscribe(data => {
      this.Server = []
      data.map(items => {
        const item = items.payload.doc.data();
        item['id'] = items.payload.doc['id'];
        this.Server.push(item as Server)
      })
    })
  }

  buildForm() {
    this.serverForm = this.fb.group({
      id: [''],
      serverIpName: ['', [Validators.required]],
      serverDescription: ['', [Validators.required]],
      serverType: ['', [Validators.required]],
      userLogin: this.fb.array([])
    })
  }

  addUserLogin() {
    const userLoginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.userLogin.push(userLoginForm);
  }

  deleteUserLogin(userLoginIndex: number) {
    this.userLogin.removeAt(userLoginIndex);
  }

  get serverIpName() {
    return this.serverForm.get('serverIpName');
  }

  get serverDescription() {
    return this.serverForm.get('serverDescription')
  }

  get serverType() {
    return this.serverForm.get('serverType')
  }

  get userLogin() {
    return this.serverForm.controls.userLogin as FormArray;
  }

  addServer() {
    if (this.serverForm.controls.id.value) {
      this.siteService.updateServer(this.id, this.serverForm.value)
    } else {
      this.siteService.addServer(this.id, this.serverForm.value)
    }
    this.serverForm.reset();
    this.userLogin.clear();
    this.isAdd = true;
    this.isEdit = false;
  }

  showAdd(value: boolean) {
    this.serverForm.reset();
    this.userLogin.clear()
    this.isAdd = value
    this.isEdit = !value
    this.isShow = false;
    this.addUserLogin()
  }

  alertCancelAddServer() {
    Swal.fire({
      title: 'Do you want to cancel add server.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.serverForm.reset();
        this.userLogin.clear()
        this.isAdd = true;
        this.isEdit = false;
        this.isShow = false;
      }
    })
  }

  editServer(server: Server) {
    this.isShow = false
    this.isAdd = false
    this.isEdit = true
    if (this.isEdit) {
      this.serverForm.patchValue({
        id: server.id,
        serverIpName: server.serverIpName,
        serverDescription: server.serverDescription,
        serverType: server.serverType,
      })
      this.setUserLogin(server.userLogin)
    }
  }

  setUserLogin(userLogin: any[]) {
    this.userLogin.clear()
    userLogin.forEach((user) => {
      const userLoginForm = this.fb.group({
        userName: [user.userName, Validators.required],
        password: [user.password, Validators.required]
      });
      this.userLogin.push(userLoginForm);
    })
  }

  alertDeleteServer(server: Server) {
    Swal.fire({
      title: 'Do you want to delete server.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2ED0B9',
      cancelButtonColor: '#9C9FA6',
      confirmButtonText: 'Yes, I do'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {
        this.siteService.removeServer(this.id, server)
      }
    })
  }

  showServer(serv: any) {
    this.serverForm.reset();
    this.userLogin.clear()
    this.isAdd = false;
    this.isEdit = false;
    this.isShow = true;
    this.serverDetails = serv
  }


}
