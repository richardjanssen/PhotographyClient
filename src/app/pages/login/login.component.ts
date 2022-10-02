import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication-service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup = new FormGroup({
        userName: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    });

    constructor(private readonly _authenticationService: AuthenticationService) {
        console.log('here');
    }
    ngOnDestroy(): void {
        console.log('destroy');
    }
    ngOnInit(): void {
        console.log('init');
    }

    submitLogin(): void {
        if (this.loginForm.valid) {
            this._authenticationService.login(this.loginForm.get('userName')!.value, this.loginForm.get('password')!.value);
        }
    }
}
