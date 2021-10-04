import { Role } from 'src/app/Models/role';
import {Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { RoleService } from 'src/app/Services/role.service';
import {UserService} from '../../Services/user.service';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../../Models/user';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/Services/token-storage.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-roles-list',
  templateUrl: 'roles-list.component.html',
  styleUrls: ['roles-list.component.css']
})

export class RolesListComponent implements OnInit{
  roles: Role[] = [];
  editRole!: Role;
  deleteRole: any;
  constructor(private toastr: ToastrService, private roleService: RoleService, private tokenStorageService: TokenStorageService , private router: Router) { }
  ngOnInit(): void{
    if (this.tokenStorageService.getToken()) {
      if (!this.tokenStorageService.getUser().roles.includes('ROLE_ADMIN')){
        this.router.navigate(['/match']).then(() => {
          window.location.reload();
        });
      }
      this.getRoles();
    }
    else{
          this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
    }
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

  public getRoles(): void {
    this.roleService.getRoles().subscribe((response: Role[]) => {
      this.roles = response;
    },
      (error: HttpErrorResponse) => {
        console.error(error.message);
      });
  }

  public onAddRole(addForm: NgForm): void{
    document.getElementById('add-role-form')?.click();
    console.log(addForm.value);
    this.roleService.addRole(addForm.value).subscribe(
      async (response: any) => {
        console.log(response);
        this.showToasterSuccess('Role added successfully!');
        await this.delay(1000);
        window.location.reload();
        
      }, (error: HttpErrorResponse) => {
        console.error(error.message);
        this.showToasterError(error.message);
      }
    );
  }

  public OnUpdateRole(role: Role): void{
    document.getElementById('update-role-form')?.click();
    this.roleService.updateRole(role, role.id).subscribe(async (response: any) => {
      this.showToasterSuccess('Role updated successfully!');
      await this.delay(1000);
      window.location.reload();
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
        this.showToasterError(error.message);
      });
  }

  public OnDeleteRole(roleId: number): void{
    this.roleService.deleteRole(roleId).subscribe(
      (response: any) => {
        console.log(response);
        this.getRoles();
        this.showToasterSuccess('Role deleted successfully!');
      },
      (error: HttpErrorResponse) => {
        console.error(error.message);
        this.showToasterError(error.message);
      }
    );
  }

  public onOpenModal(role: any, mode: string): void{
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add'){
      button.setAttribute('data-target', '#addRoleModal');
    }
    if (mode === 'edit'){
      this.editRole = role;
      button.setAttribute('data-target', '#editRoleModal');
    }
    if (mode === 'delete'){
      this.deleteRole = role;
      button.setAttribute('data-target', '#deleteRoleModal');
    }

    container?.appendChild(button);
    button.click();
  }
}



