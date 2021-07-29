import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  ServerType = ['Database Server', 'Remote Server', 'Web Server']
  constructor(
    private fb: FormBuilder,
    private siteService: SiteService
  ) { }

  ngOnInit() {
    this.buildForm()
    this.getServer()
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
      serverIp: ['', [Validators.required]],
      serverName: ['', [Validators.required]],
      serverType: ['', [Validators.required]],
    })
  }

  get serverIp() {
    return this.serverForm.get('serverIp');
  }

  get serverName() {
    return this.serverForm.get('serverName')
  }

  get serverType() {
    return this.serverForm.get('serverType')
  }

  addServer() {
    if (this.serverForm.controls.id.value) {
      this.siteService.updateServer(this.id, this.serverForm.value)
    } else {
      this.siteService.addServer(this.id, this.serverForm.value)
    }
    this.serverForm.reset();
    this.isAdd = true;
    this.isEdit = false;
  }

  showAdd(value: boolean) {
    this.serverForm.reset();
    this.isAdd = value
    this.isEdit = !value
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
        this.isAdd = true;
        this.isEdit = false;
      }
    })
  }

  editServer(server: Server) {
    this.isAdd = false
    this.isEdit = true
    if (this.isEdit) {
      this.serverForm.patchValue({
        id: server.id,
        serverIp: server.serverIp,
        serverName: server.serverName,
        serverType: server.serverType,
      })
    }
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


}
