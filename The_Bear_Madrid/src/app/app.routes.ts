import { Routes } from '@angular/router';
import { RegistroComponent } from './components/Usuario/registroComponent/registro.component';
import { LoginComponent } from './components/Usuario/loginComponent/login.component';
import { HomeComponent } from './components/Restaurante/homeComponent/home.component';
import { LayOutComponent } from './components/Restaurante/layOutComponent/lay-out.component';
import {controlGuard} from './guard/control.guard'
import { PerfilComponent } from './components/Usuario/perfilComponent/perfil.component';
import { MapComponent } from './components/Restaurante/mapComponent/map.component';

export const routes: Routes = [
    { path: '', component: RegistroComponent },//<---pendiente a cambiar
    {
        path: 'Usuario',
        children: [
            { path: 'Registro', component: RegistroComponent },
            { path: 'Login', component: LoginComponent },
            { path:'Perfil', canActivate:[controlGuard], component:PerfilComponent}
        ]
    },
    {
        path: 'Restaurante', component: LayOutComponent,
        children: [
            { path: 'Home', component: HomeComponent },
            { path: 'Map', component: MapComponent}
            
        ]
    }

];
