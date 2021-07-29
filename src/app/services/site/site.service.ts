import { Product } from '../../models/product.model';
import { Server, Site } from '../../models/site.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  constructor(
    private afs: AngularFirestore,
    private router: Router,
  ) { }

  getSitesList() {
    return this.afs.collection<Site>('site').valueChanges().pipe(switchMap(Site => {
      const productIds = (Site.map(Site => Site.productId));
      return combineLatest(of(Site), combineLatest(productIds.map(productId =>
        this.afs.collection<Product>('product', ref =>
          ref.where('id', '==', productId)).valueChanges().pipe(map(product => product[0]))
      )));
    }),
      map(([Site, product]) => {
        return Site.map(Site => {
          return {
            ...Site,
            product: product.find(a => a.id === Site.productId)
          };
        });
      }))
  }

  getSiteByName(site: string) {
    return this.afs.collection<Site>('site', (ref) => ref.where('initials', '==', site)).valueChanges().pipe(switchMap(Site => {
      const productIds = (Site.map(Site => Site.productId));
      return combineLatest(of(Site), combineLatest(productIds.map(productId =>
        this.afs.collection<Product>('product', ref =>
          ref.where('id', '==', productId)).valueChanges().pipe(map(product => product[0]))
      )));
    }),
      map(([Site, product]) => {
        return Site.map(Site => {
          return {
            ...Site,
            product: product.find(a => a.id === Site.productId)
          };
        });
      }))
  }

  getSites() {
    return this.afs.collection('site', (ref) => ref
      .orderBy('nameEN', 'asc'));
  }

  getSitesByNameSort(keyword) {
    return this.afs.collection('site', (ref) => ref
      .where('keyword', 'array-contains', keyword)
    )
  }

  getSitesByName(site: string) {
    return this.afs.collection('site', (ref) => ref.where('initials', '==', site))
  }

  getProvinces() {
    return this.afs.collection('province')
  }

  getSiteById(id: string) {
    return this.afs.doc<Site>(`site/` + id).valueChanges();
  }

  async addSite(site: Site) {
    try {
      const keyword = await this.generateKeyword(site.nameEN, site.nameTH, site.initials);
      (await this.afs.collection('site').add({
        initials: site.initials,
        nameEN: site.nameEN,
        nameTH: site.nameTH,
        productId: site.productId,
        maLevelId: site.maLevelId,
        maStartDate: site.maStartDate,
        maEndDate: site.maEndDate,
        module: site.module,
        addresses: site.addresses,
        keyword
      }).then((docRef) => {
        this.successNotification('site-mng', docRef.id);
      }))
    } catch (error) {
      console.log(error);
    }
  }

  async updateSite(site: Site, id: string) {
    try {
      const keyword = await this.generateKeyword(site.nameEN, site.nameTH, site.initials);
      (await this.afs.collection('site').doc(id).update({
        initials: site.initials,
        nameEN: site.nameEN,
        nameTH: site.nameTH,
        productId: site.productId,
        maLevelId: site.maLevelId,
        maStartDate: site.maStartDate,
        maEndDate: site.maEndDate,
        module: site.module,
        addresses: site.addresses,
        keyword
      }).then(() => {
        this.successNotification('site-mng', id)
      }))
    } catch (error) {
      console.log(error);
    }
  }

  async deleteSiteById(id: any) {
    try {
      await this.afs.collection('site').doc(id).delete();
      this.successDelete()
    } catch (err) {
      console.log(err);
    }
  }

  successNotification(path: string, data?: any | null) {
    Swal.fire({
      text: 'Your site has been saved',
      icon: 'success',
    }).then((result: any) => {
      this.router.navigate([`/${path}/${data}`]);
    });
  }

  errorNotification(path: string) {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your site hasn\'t been saved',
    }).then((result: any) => {
      this.router.navigate([`/${path}`]);
    });
  }

  successDelete() {
    Swal.fire({
      icon: 'success',
      title: 'deleted',
      text: 'Your site has been deleted',
    }).then((result: any) => {
      this.router.navigate([`site`]);
    });
  }

  errorDelete() {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your site hasn\'t  been deleted',
    }).then((result: any) => {
      this.router.navigate([`site`]);
    });
  }

  successSeverDelete(path: string, data?: any | null) {
    Swal.fire({
      icon: 'success',
      title: 'deleted',
      text: 'Your server has been deleted',
    }).then((result: any) => {
      this.router.navigate([`/${path}/${data}`]);
    });
  }

  errorServerDelete(path: string, data?: any | null) {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: 'Your server hasn\'t  been deleted',
    }).then((result: any) => {
      this.router.navigate([`/${path}/${data}`]);
    });
  }

  private async generateKeyword(siteEN: string, siteTH, initials) {
    function creatKeywords(str: string) {
      const arrName = []
      let curOrder = ''
      let curName2 = ''
      let curName3 = ''
      let curName4 = ''
      const chars = str.split('');
      for (let i = 0; i < chars.length; i++) {
        curOrder += chars[i]
        if (chars[i + 1] != undefined) {
          curName2 += chars[i]
          curName2 += chars[i + 1]
        }
        if (chars[i + 1] && chars[i + 2] != undefined) {
          curName3 += chars[i]
          curName3 += chars[i + 1]
          curName3 += chars[i + 2]
        }
        if (chars[i + 1] && chars[i + 2] && chars[i + 3] != undefined) {
          curName4 += chars[i]
          curName4 += chars[i + 1]
          curName4 += chars[i + 2]
          curName4 += chars[i + 3]
        }
        arrName.push(curOrder, chars[i], curName2, curName3, curName4)
        curName2 = ''
        curName3 = ''
        curName4 = ''
      }
      return arrName
    }
    const keywordTH = await creatKeywords(siteTH)
    const keywordENLowerCase = await creatKeywords(siteEN.toLowerCase())
    const keywordENUpperCase = await creatKeywords(siteEN.toUpperCase())
    const keywordInitialsLowerCase = await creatKeywords(initials.toLowerCase())
    const keywordInitialsUpperCase = await creatKeywords(initials.toUpperCase())
    return [
      '',
      ...keywordTH,
      ...keywordENLowerCase,
      ...keywordENUpperCase,
      ...keywordInitialsLowerCase,
      ...keywordInitialsUpperCase
    ]
  }

  getServer(id: string) {
    return this.afs.collection('site').doc(id).collection('server')
  }

  async addServer(id: string, server: Server) {
    try {
      (await this.afs.collection('site').doc(id).collection('server')
        .add({
          serverIp: server.serverIp,
          serverName: server.serverName,
          serverType: server.serverType
        }).then(() => {
          this.successNotification('site-mng', id)
        }))
    } catch (error) {
      console.log(error);
    }
  }

  async updateServer(id: string, server: Server) {
    try {
      (await this.afs.collection('site').doc(id)
        .collection('server', ref => ref
          .doc(server.id)
          .update({
            serverIp: server.serverIp,
            serverName: server.serverName,
            serverType: server.serverType
          }).then(() => {
            this.successNotification('site-mng', id)
          })
        ))
    } catch (error) {
      console.log(error);
    }
  }

  async removeServer(id: any, server: Server) {
    try {
      (await this.afs.collection('site').doc(id)
        .collection('server').doc(server.id).delete()
        .then(() => {
          this.successSeverDelete('site-mng', id)
        }))
    } catch (error) {
      console.log(error);
    }
  }

}
