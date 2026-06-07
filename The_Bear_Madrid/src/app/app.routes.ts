import { Routes } from '@angular/router';
import { LayOutComponent } from './components/Restaurante/layOutComponent/lay-out.component';
import { controlGuard } from './guard/control.guard'
import { platosResolver } from './resolver/plato.resolver';

const loadComponent = (path: string, componentName: string) =>
  () => import(path).then(m => m[componentName]);

export const routes: Routes = [
    { path: '', redirectTo: '/Restaurante/Home', pathMatch: 'full' },
    {
        path: 'Usuario',
        children: [
            { path: 'Registro', loadComponent: loadComponent('./components/Usuario/registroComponent/registro.component', 'RegistroComponent') },
            { path: 'Login', loadComponent: loadComponent('./components/Usuario/loginComponent/login.component', 'LoginComponent') }
        ]
    },
    {
        path: 'Restaurante', component: LayOutComponent,
        children: [
            { path: 'Home', loadComponent: loadComponent('./components/Restaurante/homeComponent/home.component', 'HomeComponent') },
            { path: 'Platos/:pathTipo', loadComponent: loadComponent('./components/Restaurante/platoComponent/plato.component', 'PlatoComponent'), resolve: { platosData: platosResolver } },
            { path: 'Plato/:idPlato', loadComponent: loadComponent('./components/Restaurante/mostrarPlatoComponent/mostrar-plato.component', 'MostrarPlatoComponent') },
            { path: 'Mapa', loadComponent: loadComponent('./components/Mapa/mostrar-mapa.component', 'MostrarMapaComponent') },
            { path: 'Perfil', canActivate: [controlGuard], loadComponent: loadComponent('./components/Usuario/perfilComponent/perfil.component', 'PerfilComponent') },
            { path: 'Order', loadComponent: loadComponent('./components/Restaurante/orderComponent/order.component', 'OrderComponent') }
        ]
    },
];
