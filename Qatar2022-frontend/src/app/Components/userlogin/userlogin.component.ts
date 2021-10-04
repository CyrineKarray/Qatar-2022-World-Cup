import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/Services/token-storage.service';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})
export class UserloginComponent implements OnInit {
  username: any;

  constructor(private tokenStorageService:TokenStorageService,private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.username=this.tokenStorageService.getUser().username;
    } else {
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }
  }

  public onLogout(){
    this.tokenStorageService.signOut()
    window.location.reload();
  }

}
