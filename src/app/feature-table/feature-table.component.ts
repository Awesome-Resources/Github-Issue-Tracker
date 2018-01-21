import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import {AppService} from '../app.service';
import {Subscription, Observable, BehaviorSubject} from 'rxjs';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import {NavigationEnd, Router} from '@angular/router';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import {FormComponent, payload} from '../form/form.component';

export interface dataInterface {
    status : string,
    PR_number: number,
    title: string,
    user: {
        login: string
    },
    url: string
}

@Component({
    selector: 'app-feature-table',
    templateUrl: './feature-table.component.html',
    styleUrls: ['feature-table.component.scss'],
    preserveWhitespaces: false
})

export class FeatureTableComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Collection of subscribed variables */
    subscriptions: Subscription[] = [];
    /** data container */
    data:any;
    /** display column header */
    displayedColumns = ['state', 'PR_number','title','user.login','url','updated_at'];
    /** 404 error bool*/
    dataNotFound: boolean = false;
    /** view child containers */
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('filter') filter: ElementRef;

    constructor (private appService: AppService, private router: Router, private formComponent: FormComponent) {
    }

    ngOnInit () {
        if(this.appService.data === undefined)
            return;

        if(this.appService.data.length === 0) {
            this.dataNotFound = true;
        } else {
            this.data = new MatTableDataSource(this.appService.data);
            this.data.paginator = this.paginator;
            this.data.sort = this.sort;
        }
    }

    ngAfterViewInit () {
        // listen to getting data
        let chData: Subscription = this.appService.data$.subscribe(
            (notifier: number) => {
                if (notifier !== 200 || this.appService.data.length === 0) {
                    this.dataNotFound = true;
                    return;
                }
                // clear up variable
                this.dataNotFound = false;
                this.data = new MatTableDataSource(this.appService.data);
                this.data.paginator = this.paginator;
                this.data.sort = this.sort;
            }
        );
        this.subscriptions.push(chData);
        // this will be used first time sorting and pagination
        if(this.appService.data.length !== 0) {
            this.data.paginator = this.paginator;
            this.data.sort = this.sort;
        }
    }

    /**
     * filter data
     * @param filterValue
     */
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.data.filter = filterValue;
    }

    /***
     * fetching next page data and call api request
     */
    fetchNextPage(): void {
        let payload:payload = {
            orgName : '',
            repoName : '',
            pageNo: 1,
            pageCount: 30
        };

        let splitArray = this.appService.data[0].repository_url.split('/');
        payload.orgName = splitArray[4];
        payload.repoName = splitArray[5];
        payload.pageNo = this.appService.data.length / 30 + 1;

        this.appService.fetchData(payload);
    }

    /* called when component is being destroyed
     * clean memory or unsubscribe to current events to avoid memory leaks */
    ngOnDestroy() {
        this.data = [];
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
