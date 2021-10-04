import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatchEntity } from 'src/app/Models/match';
import { Ref } from 'src/app/Models/ref';
import { MatchService } from 'src/app/Services/match.service';
import { RefService } from 'src/app/Services/ref.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ref',
  templateUrl: './ref.component.html',
  styleUrls: ['./ref.component.css']
})
export class RefComponent implements OnInit {
  Image: any;
  refs: any;
  editRef: any;
  deleteRef: any;
  matches: any;
  match: any;
  profileRef: any;
  selectedFile: any;
  httpClient: any;
  base64textString: any;
  constructor(private toastr: ToastrService, private refService: RefService, private matchService: MatchService, private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.getRefs();
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

  public getRefs(): void {
    this.refService.getRefs().subscribe((response: Ref[]) => {
      this.refs = response;
      console.log(response);
    },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      });
  }
  public getMatches(): void {
    this.matchService.getMatchEntity().subscribe((response: MatchEntity[]) => {
      this.matches = response;
    },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      });
  }

  public onAddRef(addForm: NgForm): void{
    document.getElementById('add-ref-form')?.click();
    this.match = addForm.value.match;
    delete addForm.value.match;
    addForm.value.image = this.base64textString;
    console.log(addForm.value);
    this.refService.addRef(addForm.value).subscribe(
      async (response: any) => {
        console.log(response);
        await this.delay(1000);
        this.refService.linkRefToMatch(response.id, this.match).subscribe(
          async (response: any) => {
            console.log(response);
            this.showToasterSuccess('Referee added successfully!');
            await this.delay(1000);
            window.location.reload();
          }
        );
        
      }, (error: HttpErrorResponse) => {
        console.error(error.message);
        this.showToasterError(error.message);
      }
    );
  }

  public OnDeleteRef(refId: number): void{
    this.refService.deleteRef(refId).subscribe(
      async (response: any) => {
        console.log(response);
        this.showToasterSuccess('Referee deleted successfully!');
        await this.delay(1000);
        window.location.reload();
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
        this.showToasterError(error.message);
      }
    );
  }

  public onUpdateRef(ref: Ref): void{
    document.getElementById('add-ref-form')?.click();
    this.match = ref.match;
    delete ref.match;
    console.log(ref);
    ref.image = this.base64textString;
    this.refService.updateRef(ref, ref.id).subscribe(
      async (response: any) => {
        console.log(response);
        await this.delay(1000);
        this.refService.linkRefToMatch(ref.id, this.match).subscribe(
          async (response: any) => {
            console.log(response);
            this.showToasterSuccess('Referee updated successfully!');
            await this.delay(1000);
            window.location.reload();
          }
        );
      }, (error: HttpErrorResponse) => {
        console.error(error.message);
        this.showToasterError(error.message);
      }
    );
  }

  public onFileChanged(event: any): void{
    const files = event.target.files;
    const file = files[0];

    if (files && file) {
      const reader = new FileReader();
      reader.onload = this.handleFile.bind(this);
      reader.readAsBinaryString(file);
  }
  }


  public handleFile(event: any): void {
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);
    console.log(this.base64textString);
   }

  public onOpenModal(ref: any, mode: string): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add'){
      button.setAttribute('data-target', '#addRefModal');
    }
    if (mode === 'edit'){
      this.editRef = ref;
      button.setAttribute('data-target', '#editRefModal');
    }
    if (mode === 'delete'){
      this.deleteRef = ref;
      button.setAttribute('data-target', '#deleteRefModal');
    }
    if (mode === 'profile'){
      ref.image = 'data:image/jpeg;base64,' + ref.image;
      this.profileRef = ref;
      console.log('***************');
      console.log(this.profileRef);
      button.setAttribute('data-target', '#profileRefModal');
    }
    container?.appendChild(button);
    button.click();
  }

}
