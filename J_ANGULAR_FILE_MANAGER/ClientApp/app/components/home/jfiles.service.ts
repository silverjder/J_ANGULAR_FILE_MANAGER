import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Router } from '@angular/router';  
import { ResponseContentType } from '@angular/http';
import { saveAs } from 'file-saver'; 


@Injectable()
export class JFilesService {

    //#region [기본 입력값] 
    originUrl_: string = '';
    //#endregion


    //#region [기본설정]
    constructor(private http: Http,
        @Inject('ORIGIN_URL') originUrl: string,
        private router: Router) {
        this.originUrl_ = originUrl; 
    }
    //#endregion

    //#region  Err 예외 처리 출력 공통 메서드  
    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        //if (console) console.error(errMsg);
        return Promise.reject(errMsg);
    }
    //#endregion

    //#region Class File FOLDER 

    //getFolder
    getFolder(): Promise<any | null> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(`${this.originUrl_}/api/jfiles`, options)
            .toPromise()
            .then(res => { 
                return <any>res.json();
            })
            .catch(this.handleError);
    }

    //files list
    getFileList(ref: string): Promise<{ isfolder: string; records: any[] } | null> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(
            `${this.originUrl_}/api/jfiles/list`
            , { DATA: ref }, options)
            .toPromise()
            .then(res => { 
                return <any>res.json();
            })
            .then(data => { return data; })
            .catch(this.handleError);
    };


    //delete 
    deleteF(model: any): Promise<any | null> {
        return this.http.delete(
            `${this.originUrl_}/api/jfiles/del`
            , new RequestOptions({
                headers: new Headers({ 'Content-Type': 'application/json'  }),
                body: model
            }))
            .toPromise()
            .then(res => { 
                return <any>res.json();
            })
            .then(data => { return data; })
            .catch(this.handleError);
    };


    //New Folder 
    setNewFolder(model: any): Promise<any | null> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(
            `${this.originUrl_}/api/jfiles/newfolder`
            , model, options)
            .toPromise()
            .then(res => { return <any>res.json(); })
            .then(data => { return data; })
            .catch(this.handleError);
    };
    setReName(model: any): Promise<any | null> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(
            `${this.originUrl_}/api/jfiles/rename`
            , model, options)
            .toPromise()
            .then(res => { 
                return <any>res.json();
            })
            .then(data => { return data; })
            .catch(this.handleError);
    };


    downFile(model: any) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        this.http.post(`${this.originUrl_}/api/jfiles/getfilee`, model, options)
            .toPromise()
            .then(response => {
                this.saveToFileSystem(response)
            });
    }
    private saveToFileSystem(response: any) {
        const contentDispositionHeader: string = response.headers.get('Content-Disposition');
        const parts: string[] = contentDispositionHeader.split(';');
        const filename = decodeURI(parts[1].split('=')[1]);
        const xfile = response.headers.get('x-file');
        const blob = new Blob([response['_body']], { type: xfile + ';charset=utf-8' }); 
        saveAs(blob, filename);

    } 
    //#endregion
     
}
/* 
npm install file-saver --save
npm install @types/file-saver --save  
*/