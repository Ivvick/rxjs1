import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ICustomTicketData, INearestTour, ITourLocation, ITours} from "../../../models/tours";
import {ActivatedRoute} from "@angular/router";
import {TicketsStorageService} from "../../../services/tiсkets-storage/tiсkets-storage.service";
import {IUsers} from "../../../models/users";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user/user.service";
import {forkJoin, fromEvent, map, Subscription} from "rxjs";
import {TicketService} from "../../../services/tickets/ticket.service";

@Component({
  selector: 'app-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit, AfterViewInit, OnDestroy {
  ticket: ITours | undefined;
  user: IUsers | null;
  userForm: FormGroup;
  nearestTours: INearestTour[];
  nearestToursCopy: INearestTour[];
  tourLocation: ITourLocation[];


  @ViewChild('ticketSearch') ticketSearch: ElementRef;

  ticketSearchValue: string;
  searchTicketSub: Subscription;
  ticketRestSub: Subscription;
  searchTypes = [1, 2, 3];

  constructor(private route: ActivatedRoute,
              private ticketStorage: TicketsStorageService,
              private userService: UserService,
              private ticketService: TicketService) { }

  ngOnInit(): void {
    const routeIdParam = this.route.snapshot.paramMap.get('id');
    const queryIdParam = this.route.snapshot.queryParamMap.get('id')
    const paramValueId = routeIdParam || queryIdParam;
    if (paramValueId) {
      const ticketStorage = this.ticketStorage.getStorage();
      this.ticket = ticketStorage.find((el) => el.id === paramValueId);
      console.log('this ticket', this.ticket);

      this.user = this.userService.getUser()

      this.userForm = new FormGroup<any>({
        firstName: new FormControl ('', {validators: Validators.required}),
        lastName: new FormControl ('', {validators: Validators.required}),
        cardNumber: new FormControl (''),
        birthDay: new FormControl (),
        age: new FormControl (),
        citizen: new FormControl (),
      })
    }

    forkJoin([this.ticketService.getNearestTours(), this.ticketService.getToursLocation()])
        .subscribe((data) => {
      this.tourLocation = data[1];
      this.nearestTours = this.ticketService.transformData(data[0], data[1])
          this.nearestToursCopy = [...this.nearestTours]
    })
  }

  ngAfterViewInit (): void {
    this.userForm.controls['cardNumber'].setValue(this.user?.cardNumber);
    const fromEventObserver = fromEvent(this.ticketSearch.nativeElement, 'keyup')
    this.searchTicketSub = fromEventObserver.subscribe((ev:any) => {
      this.initSearchTour();
    });
  }

  ngOnDestroy(): void {
    this.searchTicketSub.unsubscribe();
  }

  initSearchTour(): void {
    const type = Math.floor(Math.random() * this.searchTypes.length)
    if (this.ticketRestSub && !this.searchTicketSub.closed) {
      this.ticketRestSub.unsubscribe();
    }

    this.ticketRestSub = this.ticketService.getRandomNearestEvent(type).subscribe((data) => {
    if (this.ticketSearchValue) {
      this.nearestTours = this.ticketService.transformData([data], this.tourLocation);
    } else {
      this.nearestTours = [...this.nearestToursCopy]
    }
    })
  }

  onSubmit(): void {
  }

  selectDate(ev: Event): void {
  }

  initTour(): void {
    const userData = this.userForm.getRawValue();
    const postData = {...this.ticket, ...userData};
    this.ticketService.sendTourData(postData).subscribe()
  }

}
