import { Routes } from '@angular/router';
import { RegistroComponent } from './components/Usuario/registroComponent/registro.component';
import { LoginComponent } from './components/Usuario/loginComponent/login.component';
import { HomeComponent } from './components/Restaurante/homeComponent/home.component';
import { LayOutComponent } from './components/Restaurante/layOutComponent/lay-out.component';
import { controlGuard } from './guard/control.guard'
import { PerfilComponent } from './components/Usuario/perfilComponent/perfil.component';
import { MapComponent } from './components/Mapa/mapComponent/map.component';
import { PlatoComponent } from './components/Restaurante/platoComponent/plato.component';
import { MostrarMapaComponent } from './components/Mapa/mostrar-mapa.component';
import { MostrarPlatoComponent } from './components/Restaurante/mostrarPlatoComponent/mostrar-plato.component';

export const routes: Routes = [
    { path: '', redirectTo:'/Restaurante/Home', pathMatch:'full'},//<---pendiente a cambiar
    {
        path: 'Usuario',
        children: [
            { path: 'Registro', component: RegistroComponent },
            { path: 'Login', component: LoginComponent },
            { path: 'Perfil', canActivate: [controlGuard], component: PerfilComponent }
        ]
    },
    {
        path: 'Restaurante', component: LayOutComponent,
        children: [
            { path: 'Home', component: HomeComponent },
            { path: 'Platos/:pathTipo', component: PlatoComponent },
            {path:'Plato/:idPlato', component:MostrarPlatoComponent},
            { path: 'Mapa', component:MostrarMapaComponent}
            
        ]
    },
    

];
