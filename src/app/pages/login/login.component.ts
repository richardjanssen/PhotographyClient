import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication-service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup = new FormGroup({
        userName: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    });

    constructor(private readonly _authenticationService: AuthenticationService) {}

    submitLogin(): void {
        if (this.loginForm.valid) {
            this._authenticationService.login(this.loginForm.get('userName')!.value, this.loginForm.get('password')!.value);
        }
    }
}
