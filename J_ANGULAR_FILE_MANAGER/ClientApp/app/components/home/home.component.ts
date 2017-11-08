import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Tree, TreeModule, MenuItem, TreeNode, Message, ConfirmationService } from 'primeng/primeng';
import { JFiles } from './jfiles';
import { Meta } from '@angular/platform-browser';

import { JFilesService } from './jfiles.service' 

export enum MSGS_TXT { success = 1, info = 2, warn = 3, error = 4 };


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    providers: [ConfirmationService]
})
export class HomeComponent implements OnInit {

    //#region [base code]
    filesTree10: TreeNode[];
    selectedFile: TreeNode;
    items: MenuItem[] = [];
    msgs: Message[] = [];
    files: JFiles[] = [];
    files_: JFiles;
    ref_: string = "";
    downdisplay: boolean = false;
    downtext: string = "";
    downtextdata1: string = "";
    downtextdata2: string = "";
    uploadedFiles: any[] = [];
    searchword: string = '';
    addDisplay: boolean = false;
    newfolderE: string = '';


    redisplay: boolean = false;
    retext: string = "";
    retextorg: string = "";
    retextdata1: string = "";
    retextdata2: string = "";
    //#endregion

    constructor(private ds: JFilesService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private confirmationService: ConfirmationService,
        private meta: Meta) {
    }

    ngOnInit() {
        try {
            this.items = [];
            this.getAll();
            this.getList('');
        } catch (err) { }
    }




    //#region [TREE FOCUS]
    private expandRecursive_focus(focus: string) {
        if (this.filesTree10 != null) {
            this.filesTree10.forEach(node => {
                if (node.children) {
                    node.children.forEach(childNode => {
                        if (focus == childNode.data) {
                            this.selectedFile = childNode;
                            return;
                        };
                        this.expandRecursive2(childNode, focus);
                    });
                }
            });
        };
    }
    private expandRecursive2(node: TreeNode, focus: string) {
        if (node.children) {
            node.children.forEach(childNode => {
                if (focus == childNode.data) {
                    this.selectedFile = childNode;
                    return;
                };
                this.expandRecursive2(childNode, focus);
            });
        }
    }
    //#endregion




    private getAll() {
        this.ds.getFolder().then(
            (models_: JFiles) => {
                if (models_ != null) {
                    let models: TreeNode = <TreeNode>models_;
                    this.filesTree10 = [models];
                    this.expandAll();
                }
            });
    }
    private getList(ref: string) {
        this.ds.getFileList(ref).then((respnse: { isfolder: string; records: any[] }) => {
            if (respnse != null) {
                this.ref_ = respnse.isfolder;
                this.files = <any>respnse.records;

                if (this.ref_ != null) {
                    var T = this.ref_.split('/');
                    this.items = [];
                    for (var num in T) { this.items.push({ label: T[num] }); }
                };
            };
        });
    };

    expandAll() {
        this.filesTree10.forEach(node => {
            this.expandRecursive(node, true);
        });
    }
    collapseAll() {
        this.filesTree10.forEach(node => {
            this.expandRecursive(node, false);
        });
    }
    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }


    nodeSelect(event: any) {
        this.msgs = [];
        this.msgs.push({ severity: MSGS_TXT[MSGS_TXT.info], summary: 'Node Selected', detail: event.node.data });
        this.getList(event.node.fullname);
    }
    nodeUnselect(event: any) {
        this.msgs = [];
        this.msgs.push({ severity: MSGS_TXT[MSGS_TXT.info], summary: 'Node Unselected', detail: event.node.label });
    }

    // folder reload
    reload() {
        this.getList(this.ref_);
    }

    // file delete or Directory delete 
    delData(t: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + t.label + '?',
            accept: () => {
                this.ds.deleteF(t).then(models => {
                    if (models != null) {
                        if (models.icon == "DELETE") {
                            this.msgs = [];
                            this.msgs = [{ severity: MSGS_TXT[MSGS_TXT.info], summary: 'Confirmed', detail: 'Record deleted' }];
                            this.getList(this.ref_);
                            if (models.leaf) {
                                this.getAll();
                                this.expandRecursive_focus(this.ref_);
                            };
                        };
                    }
                });
            },
            reject: () => {
                this.msgs = [{ severity: MSGS_TXT[MSGS_TXT.info], summary: 'Rejected', detail: 'You have rejected' }];
            }
        });
    }

    //gopages
    goData(t: any) { if (t.leaf) { this.getList(t.data); } else { this.downData2(t.data, t.label); }; }

    //zip download folder
    downData1(t: any, t2: any) {
        this.downtext = t2 + ".zip";
        this.downtextdata1 = t;
        this.downtextdata2 = 'folder';
        this.downdisplay = true;
    };
    //file download
    downData2(t: any, t2: any) {
        this.downtext = t2;
        this.downtextdata1 = t;
        this.downtextdata2 = 'file';
        this.downdisplay = true;
    };
    downGo() {
        this.ds.downFile({
            label: this.downtext,
            data: this.downtextdata1,
            expandedIcon: this.downtextdata2,
            typem: this.downtextdata2
        });
    }



    downRename1(t: any, t2: any) {
        this.retext = t2;
        this.retextorg = t2;
        this.retextdata1 = t;
        this.retextdata2 = 'folder';
        this.redisplay = true;
    };
    //file download
    downRename2(t: any, t2: any) {
        this.retext = t2;
        this.retextorg = t2;
        this.retextdata1 = t;
        this.retextdata2 = 'file';
        this.redisplay = true;
    };

    onRe() {
        this.ds.setReName({
            label: this.retext,
            icon: this.retextorg,
            data: this.retextdata1,
            typem: this.retextdata2
        }).then(
            (pagex: JFiles) => {
                if (pagex != null) {
                    if (pagex) {
                        if (pagex.typem == '1') {
                            this.getAll(); // base tree pages
                            this.reload(); //list reload 

                            this.retext = '';
                            this.redisplay = false;
                            this.msgs = [];
                            this.msgs.push({
                                severity: MSGS_TXT[MSGS_TXT.info]
                                , summary: 'Create successfully.', detail: 'Create successfully.'
                            });
                        }
                        else if (pagex.typem == '2') {
                            this.msgs = [];
                            this.msgs.push({
                                severity: MSGS_TXT[MSGS_TXT.warn]
                                , summary: 'This URL is already in use.', detail: 'This URL is already in use.'
                            });
                        }
                        else if (pagex.typem == '3') {
                            this.msgs = [];
                            this.msgs.push({
                                severity: MSGS_TXT[MSGS_TXT.warn]
                                , summary: 'Invalid URL.', detail: 'Invalid URL.'
                            });
                        }
                    }
                    else {
                        this.msgs = [];
                        this.msgs.push({ severity: MSGS_TXT[MSGS_TXT.error], summary: 'Error Message', detail: 'Failed to change save.' });
                    }
                }
            });
    }



    onUpload(event: any) {
        this.uploadedFiles = [];
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.msgs = [];
        this.msgs.push({ severity: MSGS_TXT[MSGS_TXT.info], summary: 'File Uploaded', detail: '' });
        this.getList(this.ref_);
    }

    onNew() {
        this.ds.setNewFolder({
            LABEL: this.newfolderE,
            DATA: this.ref_
        }).then(
            (pagex: JFiles) => {
                if (pagex != null) {
                    if (pagex) {
                        if (pagex.typem == '1') {
                            this.getAll(); // base tree pages
                            this.newfolderE = '';
                            this.addDisplay = false;
                            this.msgs = [];
                            this.msgs.push({
                                severity: MSGS_TXT[MSGS_TXT.info]
                                , summary: 'Create successfully.', detail: 'Create successfully.'
                            });
                        }
                        else if (pagex.typem == '2') {
                            this.msgs = [];
                            this.msgs.push({
                                severity: MSGS_TXT[MSGS_TXT.warn]
                                , summary: 'This URL is already in use.', detail: 'This URL is already in use.'
                            });
                        }
                        else if (pagex.typem == '3') {
                            this.msgs = [];
                            this.msgs.push({
                                severity: MSGS_TXT[MSGS_TXT.warn]
                                , summary: 'Invalid URL.', detail: 'Invalid URL.'
                            });
                        }
                    }
                    else {
                        this.msgs = [];
                        this.msgs.push({ severity: MSGS_TXT[MSGS_TXT.error], summary: 'Error Message', detail: 'Failed to change save.' });
                    }
                };
            }
            );
    }
}
