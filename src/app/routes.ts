import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LikedMembersListComponent } from "./liked-members-list/liked-members-list.component";
import { MemberDetailComponent } from "./members/member-detail/member-detail.component";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { MessagesComponent } from "./messages/messages.component";
import { AuthGuard } from "./_guards/auth.guard";
import { PreventUnsavedChanges } from "./_guards/prevent-unsaved-changes.guard";
import { MemberDetailResolver } from "./_resolvers/member-detail.resolver";
import { MemberEditResolver } from "./_resolvers/member-edit.resolver";
import { MemberListResolver } from "./_resolvers/member-list.resolver";
import { MessagesResolver } from "./_resolvers/messages.resolver";

export const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
            { path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}},
            {path: 'member/edit', component: MemberEditComponent, resolve: {user: MemberEditResolver},
            canDeactivate: [PreventUnsavedChanges]},
            { path: 'liked', component: LikedMembersListComponent},
            { path: 'messages', component: MessagesComponent, resolve: {messages: MessagesResolver}}        //this name, "messages" is used to resolve data in the MessagesComponent. 
        ]
    },
    
    { path: '**', redirectTo: '', pathMatch: 'full'}
]