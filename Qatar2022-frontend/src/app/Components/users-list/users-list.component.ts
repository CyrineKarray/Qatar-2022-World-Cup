import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'selenium-webdriver';
import { Role } from 'src/app/Models/role';
import { User } from 'src/app/Models/user';
import { RoleService } from 'src/app/Services/role.service';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { UserService } from 'src/app/Services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  role: any;
  roleId: any;
  userId: any;
  users: User[] = [];
  roles: Role[] = [];
  rolesToAdd: Role[] = [];
  rolesToUpdate: Role[] = [];
  profileUser: any;
  editUser!: User;
  deleteUser: any;
  base64textString: any;
  selectedFile: any;
  constructor(private toastr: ToastrService, private userService: UserService, private roleService: RoleService, private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      if (!this.tokenStorageService.getUser().roles.includes('ROLE_ADMIN')){
        this.router.navigate(['/match']).then(() => {
          window.location.reload();
        });
      }
      this.getUsers();
      this.getRoles();
    }
    else{
          this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
    }
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

  public getUsers(): void {
    this.userService.getUsers().subscribe((response: User[]) => {
      response.forEach((user: any) => {
        if (!user.hasOwnProperty('cvv')){
          this.users.push(user);
        }
      } );
    },
    (error: HttpErrorResponse) => {
      console.error(error.message);
    });
    console.log(this.users);
  }

  public getRoles(): void {
    this.roleService.getRoles().subscribe((response: Role[]) => {
      this.roles = response;
    },
    (error: HttpErrorResponse) => {
      console.error(error.message);
    });
  }

  public onAddUser(addForm: NgForm): void{
    document.getElementById('add-user-form')?.click();
    this.rolesToAdd = addForm.value.roles;
    addForm.value.image = this.base64textString;
    delete addForm.value.roles;
    this.userService.addUser(addForm.value).subscribe(
          (response: any) => {
            this.userId = response.id;
            if (this.rolesToAdd) {
              this.userService
                .clearRoles(this.userId)
                .subscribe(async (response: any) => {
                  console.log(response);
                  await this.delay(1000);
                  this.rolesToAdd.forEach((roleId: any) => {
                    this.roleService
                      .linkNewUserToRole(this.userId, roleId)
                      .subscribe(async (response: any) => {
                        console.log(response);
                        this.showToasterSuccess('User added successfully!');
                        await this.delay(1000);
                        window.location.reload();
                      });
               });

              });

            }
            
          },

          (error: HttpErrorResponse) => {
            this.showToasterError(error.message);
          });
        }

  public OnUpdateUser(user: User): void{
    document.getElementById('add-user-form')?.click();
    this.rolesToUpdate = user.roles;
    delete user.roles;
    user.image = this.base64textString;
    console.log('***********************' + user);
    this.userService.updateUser(user, user.id).subscribe(
      (response: any) => {
        console.log(response);
        if (this.rolesToUpdate) {
          this.userService
            .clearRoles(user.id)
            .subscribe(async (response: any) => {
              console.log(response);
              await this.delay(1000);
              this.rolesToUpdate.forEach((roleId: any) => {
                this.roleService
                  .linkNewUserToRole(user.id, roleId)
                  .subscribe((response: any) => {
                    console.log(response);
                  });
           });
           this.showToasterSuccess('User updated successfully!');
              await this.delay(1000);
              window.location.reload();
          });
        }
      },
      (error: HttpErrorResponse) => {
        this.showToasterError(error.message);
      }
    );
    window.location.reload();

  }


  public OnDeleteUser(userId: number): void{
    this.userService.deleteUser(userId).subscribe(
      (response: any) => {
        console.log(response);
        this.showToasterSuccess('User deleted successfully!');
        window.location.reload();
      },
      (error: HttpErrorResponse) => {
       this.showToasterError(error.message);
      }
    );
  }

  public onFileChanged(event: any){
    let files = event.target.files;
    let file = files[0];

    if (files && file) {
      let reader = new FileReader();
      reader.onload = this.handleFile.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleFile(event: any) {
    let binaryString = event.target.result;
    this.base64textString = btoa(binaryString);
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
    if (mode === 'edit'){
      this.editUser = user;
      button.setAttribute('data-target', '#editUserModal');
    }
    if (mode === 'delete'){
      this.deleteUser = user;
      button.setAttribute('data-target', '#deleteUserModal');
    }

    if (mode === 'profile'){
      user.image = 'data:image/jpeg;base64,' + user.image;
      this.profileUser = user;
      console.log('***************');
      console.log(this.profileUser);
      button.setAttribute('data-target', '#profileUserModal');
    }

    container?.appendChild(button);
    button.click();
  }
}
