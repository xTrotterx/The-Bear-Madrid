import { Routes } from '@angular/router';
import { RegistroComponent } from './components/Usuario/registroComponent/registro.component';
import { LoginComponent } from './components/Usuario/loginComponent/login.component';
import { HomeComponent } from './components/Restaurante/homeComponent/home.component';
import { LayOutComponent } from './components/Restaurante/layOutComponent/lay-out.component';

export const routes: Routes = [
    { path: '', component: RegistroComponent },//<---pendiente a cambiar
    {
        path: 'Usuario',
        children: [
            { path: 'Registro', component: RegistroComponent },
            { path: 'Login', component: LoginComponent }
        ]
    },
    {
        path: 'Restaurante', component: LayOutComponent,
        children: [
            { path: 'Home', component: HomeComponent }
            
        ]
    }

];
