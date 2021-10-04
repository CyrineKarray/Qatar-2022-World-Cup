import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './Components/users-list/users-list.component';
import { RolesListComponent } from './Components/roles-list/roles-list.component'
import { SpectatorComponent } from './Components/spectator/spectator.component';
import { MatchComponent } from './Components/match/match.component';
import { TicketComponent } from './Components/ticket/ticket.component';
import { RefComponent } from './Components/ref/ref.component';
import { SignupComponent } from './Components/signup/signup.component';

const routes: Routes = [
  {path:'users',component:UsersListComponent},
  {path:'roles', component:RolesListComponent},
  {path:'spectators',component:SpectatorComponent},
  {path:'match',component:MatchComponent},
  {path:'ticket',component:TicketComponent},
  {path:'ref',component:RefComponent},
  {path:'',component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
