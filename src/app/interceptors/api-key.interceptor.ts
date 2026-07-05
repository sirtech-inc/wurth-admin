import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';
import { CryptUtil } from '../utils/crypt.util';
import * as bcryptjs from 'bcryptjs';


export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const cryptedApiKey = CryptUtil.cryptData(environment.apiKey);
  const encrypt = bcryptjs.hashSync(environment.apiKey, 10);
  // Clonar la request y agregar el header X-API-Key
  const clonedRequest = req.clone({
    setHeaders: {
      'X-API-Key': encrypt + ' ' + cryptedApiKey
    }
  });

  return next(clonedRequest);
};