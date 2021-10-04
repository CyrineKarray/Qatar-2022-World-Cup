import { Component, OnInit } from '@angular/core';
import { MatchEntity } from 'src/app/Models/match';
import { MatchService } from 'src/app/Services/match.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})

export class MatchComponent implements OnInit {

  title = 'Qatar';
  public matchs!: MatchEntity[];
  public editMatch!: MatchEntity;
  public deleteMatch!: MatchEntity;


  constructor(private matchService: MatchService, private tokenStorageService: TokenStorageService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.getMatches();
    }
    else{
          this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
    }
  }

  // tslint:disable-next-line:typedef
  public delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public showToasterSuccess = (msg: string) => {
    this.toastr.success(msg);
  }

  public showToasterError = (msg: string) => {
    this.toastr.error(msg);
  }
public getMatches(): void {
    this.matchService.getMatchEntity().subscribe(
      (response: MatchEntity[]) => {
        this.matchs = response;
      },
      (error: HttpErrorResponse) => {
        this.showToasterError(error.message);
      }
    );
    }

    public onAddMatch(addForm: NgForm): void{
      document.getElementById('add-match-form')?.click();
      this.matchService.addMatchEntity(addForm.value).subscribe(
        async (response: MatchEntity) => {
          console.log(response);

          await this.delay(1000);
          window.location.reload();

        },
        (error: HttpErrorResponse) => {
          this.showToasterError(error.message);
          addForm.reset();
        }
      );
      this.matchService.getMatchEntity().subscribe(
        (response: MatchEntity[]) => {
          this.matchs = response;
          this.showToasterSuccess('Match added successfully!');
          console.log(this.matchs);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          this.showToasterError(error.message);
        }
      );
    }



    public onDeleteMatch(matchId: number): void {
      this.matchService.deleteMatchEntity(matchId).subscribe(
        (response: void) => {
          console.log(response);
          this.getMatches();
          this.showToasterSuccess('Match deleted successfully!');
        },
        (error: HttpErrorResponse) => {
          this.showToasterError(error.message);
        }
      );
    }

    public onUpdateMatch(match: MatchEntity): void {
      this.matchService.updateMatchEntity(match, match.id).subscribe(
        (response: any) => {
          console.log(response);
          this.showToasterSuccess('Match updated successfully!');
          this.getMatches();
        },
        (error: HttpErrorResponse) => {
          this.showToasterError(error.message);

        }
      );
    }

    public searchMatches(key: string): void {
      console.log(key);
      const results: MatchEntity[] = [];
      for (const match of this.matchs) {
        if (match.teamA.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || match.teamB.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || match.matchType.toLowerCase().indexOf(key.toLowerCase()) !== -1
        || match.matchLocation.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
          results.push(match);
        }
      }
      this.matchs = results;
      if (results.length === 0 || !key) {
        this.getMatches();
      }
    }



    public onOpenModal(match: any, mode: string): void {
      const container = document.getElementById('main-container');
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-toggle', 'modal');
      if (mode === 'add') {
        button.setAttribute('data-target', '#addMatchModal');
      }
      if (mode === 'edit') {
      this.editMatch = match;
      button.setAttribute('data-target', '#updateMatchModal');
      }

      if (mode === 'delete') {
       this.deleteMatch = match;
       button.setAttribute('data-target', '#deleteMatchModal');
      }
      container?.appendChild(button);
      button.click();
    }
}
