import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';

import { HeaderComponent } from '../home/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [HeaderComponent, FormsModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
    returnUrl: string = '';
    formSubmitted: boolean = false;
    loading = false;
    error = '';

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

    constructor(readonly _authenticationService: AuthenticationService, private route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    }

    submitLogin(): void {
        this.loading = true;
        this.formSubmitted = true;
        
        if (this.loginForm.valid) {
            this._authenticationService
                .login({
                    username: this.loginForm.get('username')!.value,
                    password: this.loginForm.get('password')!.value
                })
                .subscribe({
                    next: response => {
                        if (response.success) {
                            this.router.navigateByUrl(this.returnUrl);
                        } else {
                            this.error = response.message;
                            this.loading = false;
                        }
                    },
                    error: error => {
                        this.error = error.message || 'Oepsie. Er is iets fout gegaan. Probeer het opnieuw.';
                        this.loading = false;
                    }
                });
        }
    }

    showValidations(formControl: AbstractControl<string, string> | null): boolean | undefined {
        return formControl?.invalid && (formControl?.dirty || formControl?.touched || this.formSubmitted);
    }
}
