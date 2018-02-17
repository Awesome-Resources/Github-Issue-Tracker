import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from "@angular/router";
import {FormsModule, FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {FlexLayoutModule} from '@angular/flex-layout';

import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatToolbarModule,
    MatStepperModule, MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
} from '@angular/material';

import 'hammerjs';

// in app components
import {FormComponent} from "./form/form.component";
import {TableComponent} from "./table/table.component";

// in app routes
import {AppRoutes} from "./app.routes";
import {AppService} from "./app.service";
import {FeatureTableComponent} from "./feature-table/feature-table.component";

@NgModule({
    declarations : [
        AppComponent,
        FormComponent,
        TableComponent,
        FeatureTableComponent,
    ],
    imports : [
        BrowserModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,

        // Material
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatToolbarModule,
        MatStepperModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        // Flex-layout
        FlexLayoutModule,

        // user routes
        AppRoutes
    ],
    providers : [
        FormBuilder,
        AppService,
        FormComponent
    ],
    exports :[
    ],
    entryComponents : [FormComponent],
    bootstrap : [AppComponent]
})
export class AppModule {
}
