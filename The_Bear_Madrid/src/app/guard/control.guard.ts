import { CanActivateFn, Router } from '@angular/router';
;
import { inject } from '@angular/core';
import IStorageSvc from '../modelos/IStorageSvc';
import { HTTP_INJECTIONTOKEN_STORAGE_SVCS } from '../app.config';

export const controlGuard: CanActivateFn = (route, state) => {
  //guard q controla el acceso a determinadas rutas restringidas a si el usuario ha iniciado sesion o no...
  //injectamos el servicio de almacenamiento global para ver si tenemos datos del cliente o tokens de sesion...
    let _storageSvc:IStorageSvc=inject(HTTP_INJECTIONTOKEN_STORAGE_SVCS);
    let _router:Router=inject(Router);
    
    if (_storageSvc.getDatosUsuario()) {
        return true; 
    } else {
        //return false; // <---- si lo dejo asi, salta en navegador error 501 de acceso denegado
        // redirijo al login
        return  _router.navigateByUrl('/Usuario/Login');
    }
  
};