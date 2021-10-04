
import { Component, OnInit } from '@angular/core';
import { Spectator } from 'src/app/Models/spectator';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { SpectatorService } from 'src/app/Services/spectator.service';
import { TicketService } from 'src/app/Services/ticket.service';
import { TicketEntity } from 'src/app/Models/ticket';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-spectator',
  templateUrl: './spectator.component.html',
  styleUrls: ['./spectator.component.css']
})
export class SpectatorComponent implements OnInit{
  title = 'qatar2022';
  public spectators: Spectator[] = [];
  public editSpectator!: Spectator;
  public deleteSpectator: any;
  public tickets: TicketEntity[] = [];
  ticketDetails: any;
  public ticketId: any;
  public spectatorId: any;
  public myObject!: Spectator;

  constructor(private toastr: ToastrService, private spectatorService: SpectatorService, private ticketService: TicketService, private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void{
    if (this.tokenStorageService.getToken()) {
      if (!this.tokenStorageService.getUser().roles.includes('ROLE_MODERATOR')){
        this.router.navigate(['/match']).then(() => {
          window.location.reload();
        });
      }
      this.getSpectators();
      this.getTickets();
    }
    else{
          this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
    }
  }


  public getTickets(): void {
    this.ticketService.getTicketEntity().subscribe(
      (Response: TicketEntity[] ) => {
        this.tickets = Response;
        console.log(Response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getSpectators(): void {
    this.spectatorService.getSpectators().subscribe(
      (Response: Spectator[] ) => {
        this.spectators = Response;
        console.log(Response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }

    );
  }

  public delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  public showToasterSuccess = (msg: string) => {
    this.toastr.success(msg);
  }

  public showToasterError = (msg: string) => {
    this.toastr.error(msg);
  }


  public onAddSpectator(addForm: NgForm): void{
    document.getElementById('add-spectator-form')?.click();
    this.ticketId = addForm.value.tickets;
    this.myObject = {
      firstName: addForm.value.firstName,
      lastName: addForm.value.lastName,
      email: addForm.value.email,
      country: addForm.value.country,
      tel: addForm.value.tel,
      dob: addForm.value.dob,
      username: addForm.value.username,
      password: addForm.value.password,
      image: addForm.value.image,
      cardNumber: addForm.value.cardNumber,
      expiration: addForm.value.expiration,
      cvv: addForm.value.cvv,
      tickets: null,
    };
    console.log(this.myObject);
    console.log(this.ticketId);

    this.spectatorService.addSpectator(this.myObject).subscribe(
      async (response: any) => {
        this.getSpectators();
        this.spectatorId = response.id;
        console.log('inside add spectator');
        await this.delay(1000);
        this.spectatorService.linkSpectatorToTicket(response.id, addForm.value.tickets).subscribe(

          (response: any) => {
            console.log(response);
          }, (error: HttpErrorResponse) => {
            console.log(error.message);
          }
        );
        this.showToasterSuccess('Spectator added successfully!');
        await this.delay(1000);
        window.location.reload();
        
      }, (error: HttpErrorResponse) => {
        console.log(error.message);
        this.showToasterError(error.message);
      }
    );
  }


  public onUpdateSpectator(spectatorId: any, spectator: Spectator): void {
    this.myObject = {
      firstName: spectator.firstName,
      lastName: spectator.lastName,
      email: spectator.email,
      country: spectator.country,
      tel: spectator.tel,
      dob: spectator.dob,
      username: spectator.username,
      password: spectator.password,
      image: spectator.image,
      cardNumber: spectator.cardNumber,
      expiration: spectator.expiration,
      cvv: spectator.cvv,
      tickets: null,
    };
    this.spectatorId = spectator.id;

    console.log(this.ticketId);
    console.log(this.myObject);
    this.spectatorService.updateSpectator(this.spectatorId, this.myObject ).subscribe(
      async (response: any) => {
        console.log(response);
        if (spectator.tickets) {
          this.spectatorService.linkSpectatorToTicket(spectatorId, spectator.tickets[0]).subscribe(
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
        this.showToasterSuccess('Spectator updated successfully!');
        this.delay(1000);
        this.getSpectators();
      }, (error: HttpErrorResponse) => {
        this.showToasterError(error.message);
      }
    );
  }






  public onDeleteSpectator(spectatorId: number): void {
    this.spectatorService.deleteSpectator(spectatorId).subscribe(
      async (response: void) => {
        console.log(response);
        this.showToasterSuccess('Spectator deleted successfully!');
        await this.delay(1000);
        window.location.reload();
      },
      (error: HttpErrorResponse) => {
        this.showToasterError(error.message);
      }
    );

  }

  public searchSpectators(key: string): void {
    console.log(key);
    const results: Spectator[] = [];
    for (const spectator of this.spectators){
      if (spectator.firstName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || spectator.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || spectator.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || spectator.username.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(spectator);
      }
    }
    this.spectators = results;
    if (results.length === 0 || !key){
      this.getSpectators();
    }
  }

  public onOpenModal(specator: any, mode: string): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add'){
      button.setAttribute('data-target', '#addSpectatorModal');
    }
    if (mode === 'edit'){
      this.editSpectator = specator;
      button.setAttribute('data-target', '#updateSpectatorModal');
    }
    if (mode === 'delete') {
      this.deleteSpectator = specator;
      button.setAttribute('data-target', '#deleteSpectatorModal');
    }
    if (mode === 'details'){
      this.ticketDetails = specator;
      button.setAttribute('data-target', '#sessionDetailsModal');
    }
    container?.appendChild(button);
    button.click();
  }
}

