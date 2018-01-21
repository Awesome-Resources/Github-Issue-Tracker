import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import {MatIconRegistry, MatDialog} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

import 'rxjs/add/operator/filter';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AppService} from "./app.service";

@Component({
    selector : 'app-root',
    templateUrl : './app.component.html',
    styleUrls : ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
    isDarkTheme = false;
    isLoading: boolean = false;
    /** Collection of subscribed variables */
    subscriptions: Subscription[] = [];

    routeChange: boolean = false;

    constructor (iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private dialog: MatDialog, private router: Router, private appService: AppService) {
        // To avoid XSS attacks, the URL needs to be trusted from inside of your application.
        const avatarsSafeUrl = sanitizer.bypassSecurityTrustResourceUrl('./assets/avatars.svg');

        iconRegistry.addSvgIconSetInNamespace('avatars', avatarsSafeUrl);

        let routePath: string;
        // router.events.subscribe((event: Event) => {
        //     if (event instanceof NavigationEnd ) {
        //         routePath = event.url;
        //     }
        //     if(event.url == undefined)
        //         return;
        //     if(event.url == "/data" && this.appService.routeChange == false)
        //         router.navigateByUrl('/add');
        // });
    }

    ngOnInit () {
        this.routeChange = this.appService.routeChange;
    }

    ngAfterViewInit () {
        // listen to changes on global loading notifier
        let chObsIsDataLoading: Subscription = this.appService.isDataLoading$.subscribe(
            (notifier: boolean) => {
                // update loading notifier
                if (notifier)
                    this.isLoading = notifier;
                else {
                    setTimeout(() => {
                        this.isLoading = notifier;
                    }, 1000);
                }
            }
        );
        this.subscriptions.push(chObsIsDataLoading);
        let chData: Subscription = this.appService.data$.subscribe(
            (notifier: number) => {
                this.routeChange = this.appService.routeChange;
            }
        );
    }

    /**
     * add button it changes route on clicking on it
     */
    addButton(): void {
        this.routeChange = false;
    }

    /* called when component is being destroyed
     * clean memory or unsubscribe to current events to avoid memory leaks */
    ngOnDestroy () {
        for (let subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
