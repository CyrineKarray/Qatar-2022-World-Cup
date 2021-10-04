import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/Services/token-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {


  activeClass:string;
  show: any=false;
  isAdmin: any=false;
  isModerator: any=false;
  constructor(private tokenStorageService:TokenStorageService) {
    this.activeClass='active'
   }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.show=true;
    } else {
      this.show=false;
    }

    if(this.tokenStorageService.getUser().roles.includes("ROLE_ADMIN")){
      this.isAdmin=true;
    }

    if(this.tokenStorageService.getUser().roles.includes("ROLE_MODERATOR")){
      this.isModerator=true;
    }
  }
  

  public clickFun(event:any){
    var list: any = document.getElementsByClassName('item');
    for (let item of list) {
    item.removeAttribute('id');
    }
    event.target.setAttribute('id','active');
  }

  
  public clickReset(){
    var list: any = document.getElementsByClassName('item');
    for (let item of list) {
    item.removeAttribute('id');
    }
  }

}
