import { Routes } from '@angular/router';
import { RegistroComponent } from './components/Usuario/registroComponent/registro.component';
import { LoginComponent } from './components/Usuario/loginComponent/login.component';

export const routes: Routes = [
    { path:'', component:RegistroComponent},
       { path: 'Usuario',
        children:[
            {path:'Registro', component:RegistroComponent},
            {path:'Login', component:LoginComponent}
        ]
    },
    {
        path: 'Restaurante',
            children:[
                {path:'Home', component: HomeComponent},
                
            ]
    }
    
];
