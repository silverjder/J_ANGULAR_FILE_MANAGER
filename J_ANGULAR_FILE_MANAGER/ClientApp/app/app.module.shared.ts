import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


import { NoopAnimationsModule } from '@angular/platform-browser/animations'; 
import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
 

import {
    MessagesModule, TreeModule, GrowlModule, ButtonModule
    , ContextMenuModule, TabViewModule, CodeHighlighterModule, BreadcrumbModule
    , DataTableModule, ConfirmDialogModule, DialogModule, FileUploadModule
} from 'primeng/primeng';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent
    ],
    imports: [
     
        CommonModule,
        HttpModule,
        FormsModule,
        NoopAnimationsModule, 
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: '**', redirectTo: 'home' }
        ])

        , MessagesModule, TreeModule, GrowlModule, ButtonModule
        , ContextMenuModule, TabViewModule, CodeHighlighterModule
        , BreadcrumbModule, DataTableModule, ConfirmDialogModule, DialogModule, FileUploadModule
    ]
})
export class AppModuleShared {
}
