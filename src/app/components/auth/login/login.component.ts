import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Login } from '../../../shared/action/auth.action';
import { AuthService } from '@shared/services/auth.service';
import { AuthUserStateModel } from '@shared/interface';
import { NotificationService } from '@shared/services/notification.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  public form: FormGroup;
  private notificationService: NotificationService;

  constructor(
    private store: Store,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    this.form.markAllAsTouched();
    if(this.form.valid) {
      const auth: AuthUserStateModel = this.form.value;

      this.authService.LoginUsuario(auth).subscribe({
        next: (res) => {
          if (res.result.status > 0) {
            this.toastr.success("Acceso Exitoso");
            this.router.navigateByUrl("/dashboard");
          } else {
            this.toastr.error(res.result.errors || 'Aviso');
          }
        },
        error: (err) => {
          console.error("Error de servidor:", err);
        },
      });
    }
  }
  
}
