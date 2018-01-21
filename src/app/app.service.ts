// import built-in and third party modules by Node.js
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AppService {
    constructor (private http: HttpClient, private router: Router) {
    }

    /**
     * Observer for fetch github issue data API call.
     * It provides observable to notify about getting data
     */
    subjectData = new Subject<number>();
    /**
     * Notify changes for fetchData API call.
     * Listeners themselves will have to check for the incoming documents from appService.
     */
    data$ = this.subjectData.asObservable();
    /** Notifier code for any change detected by any subect */
    readonly successNotifier: number = 200;
    /** Notifier code for any change rejected by any subject */
    readonly failureNotifier: number = 404;
    /** Observer for loading notifier */
    private subjectIsDataLoading = new Subject<boolean>();
    /**
     * Notify changes for a loading notifier.
     * The observable object notifies its existing listeners about loading notifier.
     * It passes boolean value of isDataLoading in observable parameters.
     */
    isDataLoading$ = this.subjectIsDataLoading.asObservable();
    /** A status variable to keep track of notifiers triggered by external events. */
    private isExternDataLoading: boolean = false;
    /** data container */
    data = [];
    /** route changed */
    routeChange: boolean = false;
    dataNotFound: string = '';

    /**
     * Manipulate the global loading notifier based on the existing local loading notifier
     * @param {boolean} isDataLoading Notifier value to set
     */
    updateGlobalNotifier(isDataLoading: boolean): void {
        this.isExternDataLoading = isDataLoading;
        this.subjectIsDataLoading.next(isDataLoading);
    }

    /**
     * Make an API request to fetch data
     * @param {any} payload of user data
     */
    fetchData (payload: any): void {
        /* set up header parameters
         * include access token stored in localStorage */
        // notify other components
        this.subjectIsDataLoading.next(true);
        // make http request
        this.http.get("https://api.github.com/repos/"+payload.orgName + "/" + payload.repoName + "/issues?page=" + payload.pageNo + "&per_page=" + payload.pageCount + "&state=all")
            .subscribe(
            (res: any) => {
                // assign reports from response to local variable in context
                if(this.data.length == 0) {
                    this.data = res;
                    this.router.navigateByUrl('/data');
                } else if (this.data.length > 0){
                    this.data = this.data.concat(res);
                }
                this.routeChange = true;
                // send success via broadcast to notify other components
                this.subjectData.next(this.successNotifier);
                // notify other components
                this.subjectIsDataLoading.next(false);
            },
            (err: number) => {
                this.data = [];
                this.dataNotFound = "Data not found please check organization or repository name";
                this.router.navigateByUrl('/data');
                // notify other components
                this.subjectIsDataLoading.next(false);
                // send failure via broadcast to notify other components
                this.subjectData.next(this.failureNotifier);
            }
        );
    }
}