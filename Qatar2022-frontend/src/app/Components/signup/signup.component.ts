import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Services/user.service';
import { RoleService } from 'src/app/Services/role.service';
import { Role } from 'src/app/Models/role';
import { User } from 'src/app/Models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  role: any;

  roleId: any;
  userId: any;
  users: User[] = [];
  roles: Role[] = [];
  rolesToAdd: Role[] = [];
  rolesToUpdate: Role[] = [];
  editUser!: User;
  deleteUser: any;
  isLoginFailed: any = false;
  isLoggedIn: any;
  base64textString: any;
  // tslint:disable-next-line:max-line-length
  constructor(private toastr: ToastrService, private userService: UserService, private roleService: RoleService, private tokenStorage: TokenStorageService , private authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    this.getRoles();
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/match']).then(() => {
        window.location.reload();
      });
    }
  }

  public showToasterSuccess = (msg: string) => {
    this.toastr.success(msg);
  }

  public showToasterError = (msg: string) => {
    this.toastr.error(msg);
  }

  public getRoles(): void {
    this.roleService.getRoles().subscribe((response: Role[]) => {
      this.roles = response;
    },
    (error: HttpErrorResponse) => {
      console.error(error.message);
    });
  }


  public onAddUser(addForm: NgForm): void {
    document.getElementById('add-user-form')?.click();
    this.rolesToAdd = addForm.value.roles;
    delete addForm.value.roles;
    addForm.value.image = this.base64textString;
    this.userService.addUser(addForm.value).subscribe(
      (response: any) => {
                    this.userId = response.id;
                    this.roleService
                    .linkNewUserToRole(this.userId, 1)
                    .subscribe((response: any) => {
                      console.log(response);
                    });
                    this.showToasterSuccess('User added successfully');
                    this.router.navigateByUrl('/');
                    addForm.reset();
                    
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
        this.showToasterError(error.message);

      }
    );

  }

   onFileChanged = (event: any) => {
    const files = event.target.files;
    const file = files[0];

    if (files && file) {
      const reader = new FileReader();
      reader.onload = this.handleFile.bind(this);
      reader.readAsBinaryString(file);
    }
  }


  handleFile = (event: any) => {
    const binaryString = event.target.result;
    this.base64textString = btoa(binaryString);
    console.log(this.base64textString);
  }


  public onLoginUser(loginForm: NgForm): void {
    this.authService.login(loginForm.value).subscribe(
      (response: any) => {
        this.tokenStorage.saveToken(response.accessToken);
        this.tokenStorage.saveUser(response);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate(['/match']).then(() => {
          window.location.reload();
        });
      },
      (error: HttpErrorResponse) => {
        this.isLoginFailed = true;
        this.showToasterError(error.message);
      }
    );

  }





  public onOpenModal(user: any, mode: string): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add'){
      button.setAttribute('data-target', '#addUserModal');
    }
    if (mode === 'login'){
      button.setAttribute('data-target', '#loginUserModal');
    }

    container?.appendChild(button);
    button.click();
  }

}
