import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NgIf } from '@angular/common';
import { HeaderComponent } from '../home/header/header.component';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [HeaderComponent, FormsModule, ReactiveFormsModule, NgIf]
})
export class LoginComponent {
    formSubmitted: boolean = false;
    loginForm: FormGroup = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    });

    get username(): AbstractControl<string, string> | null {
        return this.loginForm.get('username');
    }

    get password(): AbstractControl<string, string> | null {
        return this.loginForm.get('password');
    }

    constructor(private readonly _authenticationService: AuthenticationService) {}

    submitLogin(): void {
        if (this.loginForm.valid) {
            this._authenticationService.login(this.loginForm.get('username')!.value, this.loginForm.get('password')!.value);
        }
        this.formSubmitted = true;
    }

    showValidations(formControl: AbstractControl<string, string> | null): boolean | undefined {
        return formControl?.invalid && (formControl?.dirty || formControl?.touched || this.formSubmitted);
    }
}
