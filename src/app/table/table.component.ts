import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {AppService} from "../app.service";
import {Subscription} from "rxjs";
import * as _ from "lodash";

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import {payload} from "../form/form.component";
import {NavigationEnd, Router} from "@angular/router";

export interface dataInterface {
    status: string,
    PR_number: number,
    title: string,
    user: string,
    url: string
}

@Component({
    selector : 'app-table',
    templateUrl : './table.component.html',
    styleUrls : ['table.component.scss'],
    preserveWhitespaces : false
})

export class TableComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Collection of subscribed variables */
    subscriptions: Subscription[] = [];
    /** data container */
    data = [];
    // counter variable
    counter: number;
    // sort assign variable
    sortBool: boolean = false;
    // filter assign variable
    filterBool: boolean = false;
    // page no
    pageNo: number = 1;
    // all issue count
    allPageNo: number;
    // column header of table
    resHeaders = ["Issue Type", "PR Number", "Title", "User", "Patch Url", "Updated Time"];
    searchHeaders = [{ "key" : "Issue Type", "value" : "state" },
        { "key" : "Title", "value" : "title" },
        { "key" : "User", "value" : "user.login" }];
    // sort assign for ascending or descending
    sortOrder: string = this.resHeaders[0];
    // search string
    searchBy: string;
    // 404 error
    dataNotFound: boolean = false;
    // page no
    page: number = 1;
    // item per page
    itemsPerPage: number = 10;

    constructor (private appService: AppService, private router: Router) {
    }

    ngOnInit () {
        this.data = this.appService.data;
        this.allPageNo = Math.floor(this.appService.data[0].number / 30);

        // if (this.appService.dataNotFound !== '') {
        //     this.data = this.appService.data;
        //     this.allPageNo = Math.floor(this.appService.data[0].number / 30);
        // } else {
        //     this.data = [];
        //     this.dataNotFound = "Data not found please check organization or reposiratory name";
        // }
    }

    ngAfterViewInit () {
        // listen to getting data
        let chData: Subscription = this.appService.data$.subscribe(
            (notifier: number) => {
                if (notifier !== 200) {
                    this.dataNotFound = true;
                    return;
                }
                // clear up variable
                this.dataNotFound = false;
                if (this.appService.data[0].sortEnabled == false && this.filterBool == false) {
                    if (this.appService.data.length > 30 && this.appService.data[0].nextEnabled == true)
                        this.data = this.appService.data.slice(Math.max(this.appService.data.length - 30, 1));
                    else if (this.appService.data[0].nextEnabled == false)
                        this.data = this.appService.data;
                }

                if (this.appService.data[0].previousEnabled == true) {
                    // this.data = this.appService.data.slice(Math.max(this.appService.data.length, this.appService.data.length - 30));
                    this.data = this.appService.data.slice(30);
                }

                this.pageNo = this.appService.data.length / 30;
                this.allPageNo = Math.floor(this.appService.data[0].number / 30);
                // notify other components
                this.appService.updateGlobalNotifier(false);
            }
        );
        this.subscriptions.push(chData);
    }

    /**
     * Display time in human format
     * @param {number} time Time from server in epoch format
     * @returns Time in human readable format
     */
    displayTime (time: number): string {
        let t = new Date(time);
        return t.getDate() + "/" + t.getMonth() + '/' + t.getFullYear();
    }

    /**
     * get user data
     * @param user
     * @returns {any}
     */
    getUser (user: any): string {
        if (user.login)
            return user.login;
        return "";
    }

    selectSort (sortOrder) {
        this.sortOrder = sortOrder;
    }

    /**
     * sort data in descending order
     * @param item
     */
    sortItemDesc (item: any): void {
        item = this.sortOrder;
        this.sortBool = true;
        this.appService.data[0].sortEnabled = true;
        switch (item) {
            case "Issue Type":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.state;
                }]);
                break;
            case "PR Number":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.number;
                }]);
                break;
            case "Title":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.title
                }]);
                break;
            case "User":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.user.login
                }]);
                break;
            case "Patch Url":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.number
                }]);
                break;
            case "Updated Time":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.updated_at
                }]);
                break;
        }
        this.appService.subjectData.next(this.appService.successNotifier)
    }

    /**
     * sort data in ascending order
     * @param item
     */
    sortItemAsc (item: any): void {
        item = this.sortOrder;
        this.sortBool = false;

        this.appService.data[0].sortEnabled = true;
        switch (item) {
            case "Issue Type":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.state;
                }]).reverse();
                break;
            case "PR Number":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.number;
                }]).reverse();
                break;
            case "Title":
                // this.data = _.sortBy(this.data, [function(o) { return o.title.charCodeAt() * -1}]).reverse();
                this.data = _.sortBy(this.data, [function (o) {
                    return o.title
                }]).reverse();
                break;
            case "User":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.user.login
                }]).reverse();
                break;
            case "Patch Url":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.number
                }]).reverse();
                break;
            case "Updated Time":
                this.data = _.sortBy(this.data, [function (o) {
                    return o.updated_at
                }]).reverse();
                break;
        }
        this.appService.subjectData.next(this.appService.successNotifier)
    }

    /**
     * search var function
     * @param searchBy
     */
    selectSearch (searchBy) {
        this.searchBy = searchBy;
    }

    /**
     * search data
     * @param event
     * @returns {Array}
     */
    searchData (event) {
        //enabling filter boolean
        this.filterBool = true;

        // filter out data
        const filterValue = event;

        if (this.searchBy == 'title')
            this.data = filterValue ? this.data.filter(data => data.title.toLowerCase()
                    .startsWith(filterValue)) : this.data;
        else if (this.searchBy == 'state')
            this.data = filterValue ? this.data.filter(data => data.state.toLowerCase()
                    .startsWith(filterValue)) : this.data;
        else if (this.searchBy == 'user.login')
            this.data = filterValue ? this.data.filter(data => data.user.login.toLowerCase()
                    .startsWith(filterValue)) : this.data;

        // filling up data if no search found
        if (event == '')
            this.data = this.appService.data;

        // checking for undefined result
        if (this.data == undefined)
            return;

        // notify subscriber
        this.appService.subjectData.next(this.appService.successNotifier);
        return this.data;
    }

    /***
     * fetching previous page data
     */
    fetchPreviousPage (): void {
        this.appService.data[0].previousEnabled = true;
        this.data = this.appService.data.slice(Math.max(this.appService.data.length, this.appService.data.length - 30));

        this.appService.subjectData.next(this.appService.successNotifier);
    }

    /***
     * fetching next page data and call api request
     */
    fetchNextPage (): void {
        let payload: payload = {
            orgName : '',
            repoName : '',
            pageNo : 1,
            pageCount : 30
        };

        let splitArray = this.data[0].repository_url.split('/');
        payload.orgName = splitArray[4];
        payload.repoName = splitArray[5];
        payload.pageNo = this.appService.data.length / 30 + 1;

        this.appService.fetchData(payload);
    }

    /**
     * change page data
     * TODO need logic for previous page
     * @param page
     * @param data
     * @returns {any[]}
     */
    changePage (page: any, data: Array<any> = this.data): Array<any> {
        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    }

    /* called when component is being destroyed
     * clean memory or unsubscribe to current events to avoid memory leaks */
    ngOnDestroy () {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
