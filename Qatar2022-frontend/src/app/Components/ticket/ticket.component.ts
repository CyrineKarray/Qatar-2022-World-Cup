import { Component, OnInit } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { TicketEntity } from 'src/app/Models/ticket';
import { TicketService } from 'src/app/Services/ticket.service';
import { MatchService } from 'src/app/Services/match.service';
import { MatchEntity } from 'src/app/Models/match';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})

export class TicketComponent implements OnInit {

  title = 'Qatar';
  public tickets!: TicketEntity[];
  public editTicket!: TicketEntity;
  public deleteTicket!: TicketEntity;

  public matchs!: MatchEntity[];
  public matchId: any;
  public ticketId: any;
  public myObject!: TicketEntity;

  constructor(private toastr: ToastrService, private ticketService: TicketService, private matchService: MatchService, private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      if (!this.tokenStorageService.getUser().roles.includes('ROLE_MODERATOR')){
        this.router.navigate(['/match']).then(() => {
          window.location.reload();
        });
      }
      this.getTickets();
      this.getMatchs();
    }
    else{
          this.router.navigate(['/']).then(() => {
          window.location.reload();
        });

  }
}


public getTickets(): void {
    this.ticketService.getTicketEntity().subscribe(
      (response: TicketEntity[]) => {
        this.tickets = response;
        console.log(this.tickets);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    }
    public getMatchs(): void {
      this.matchService.getMatchEntity().subscribe((response: MatchEntity[]) => {
          this.matchs = response;
          console.log(this.matchs);
        },
        (error: HttpErrorResponse) => {
          console.error(error.message);
        });
    }
    public delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

  public showToasterSuccess = (msg: string) => {
    this.toastr.success(msg);
  }

  public showToasterError = (msg: string) => {
    this.toastr.error(msg);
  }

    public onAddTicket(addForm: NgForm): void{
      document.getElementById('add-ticket-form')?.click();
      this.matchId = addForm.value.match;
      this.myObject = {
        price: addForm.value.price,
        ticketType: addForm.value.ticketType,
        ticketNumber: addForm.value.ticketNumber,
        match: null,
      };
      console.log(this.myObject);
      console.log(this.matchId);

      this.ticketService.addTicketEntity(this.myObject).subscribe(
        async (response: any) => {
          this.getTickets();
          this.ticketId = response.id;
          console.log('inside add ticket');
          this.matchService.linkMatchToTicket(this.ticketId, this.matchId).subscribe(
            async (response: any) => {
              console.log(response);
              this.showToasterSuccess('Ticket added successfully!');
              await this.delay(1000);
              window.location.reload();
            }, (error: HttpErrorResponse) => {
              console.log(error.message);
            }
          );
         
        }, (error: HttpErrorResponse) => {
          console.log(error.message);
          this.showToasterError(error.message);
        }
      );
    }


    public onDeleteTicket(Id: any): void {
      this.ticketService.deleteTicketEntity(Id).subscribe(
        async (response: void) => {
          console.log(response);
          this.showToasterSuccess('Ticket deleted successfully!');

          await this.delay(1000);
          window.location.reload();
        },
        (error: HttpErrorResponse) => {
          this.showToasterError(error.message);
        }
      );
    }


    public onUpdateTicket(ticket: TicketEntity): void {
      this.myObject = {
        price: ticket.price,
        ticketType: ticket.ticketType,
        ticketNumber: ticket.ticketNumber,
        match: null
      };
      this.ticketId = ticket.id;

      console.log(this.ticketId);
      console.log(this.myObject);
      this.ticketService.updateTicketEntity(this.myObject, this.ticketId).subscribe(
        async (response: any) => {
          console.log(response);
          if (ticket.match) {
            this.matchService.linkMatchToTicket(this.ticketId, ticket.match).subscribe(
              async (response: any) => {
                console.log('inside link');
                console.log(response);
                await this.delay(1000);
                window.location.reload();
              }, (error: HttpErrorResponse) => {
                console.log(error.message);
              }
            );
          }
          this.showToasterSuccess('Ticket updated successfully!');
          this.delay(1000);
          this.getTickets();
        }, (error: HttpErrorResponse) => {
          this.showToasterError(error.message);
        }
      );
    }

    public searchTickets(key: string): void {
      console.log(key);
      const results: TicketEntity[] = [];
      for (const ticket of this.tickets) {
        if (ticket.ticketType.toLowerCase().indexOf(key.toLowerCase()) !== -1)
        {
          results.push(ticket);
        }
      }
      this.tickets = results;
      if (results.length === 0 || !key) {
        this.getTickets();
      }
    }


    public onOpenModal(ticket: any, mode: string): void {
      const container = document.getElementById('main-container');
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-toggle', 'modal');
      if (mode === 'add') {
        button.setAttribute('data-target', '#addTicketModal');
      }
      if (mode === 'edit') {
      this.editTicket = ticket;
      button.setAttribute('data-target', '#updateTicketModal');
      }

      if (mode === 'delete') {
       this.deleteTicket = ticket;
       button.setAttribute('data-target', '#deleteTicketModal');
      }
      container?.appendChild(button);
      button.click();
    }
}
