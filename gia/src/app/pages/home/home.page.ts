import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { filter, isNumber, toPairs } from 'lodash-es';
import { InitiativesConfigurationService } from 'src/app/services/initatives-configuration.service';
import {
  Languages,
  TranslationService,
} from 'src/app/services/translation.service';
import { Form } from '../../models/form.model';

export enum Level {
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level4 = 4,
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  form: Form;
  currentInitative: string;
  currentLanguage: string;
  currentLevel: Level;

  constructor(
    protected initiativesConfigurationService: InitiativesConfigurationService,
    protected translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.form = new Form({
      initiative: new FormControl(undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(99),
        (control: AbstractControl): ValidationErrors | null => {
          const forbidden = !Number.isInteger(control.value);
          return forbidden ? { forbiddenName: { value: control.value } } : null;
        },
      ]),
    });

    this.currentInitative = undefined;
    this.currentLanguage = this.translationService.language;
    this.currentLevel = Level.Level2;
  }

  onSubmit() {
    if (!this.form.canSubmit()) return;

    this.currentInitative = this.getInitiativeTranslationId(
      this.form.get('initiative')
    );
  }

  getInitiativeTranslationId(initative: number): string {
    let translationId: string = undefined;

    this.initiativesConfigurationService.configuration.forEach((level1) => {
      if (translationId) return;

      level1.values.forEach((level2) => {
        if (translationId) return;

        level2.values.forEach((level3) => {
          if (translationId) return;

          level3.values.forEach((level4) => {
            if (level4.value === initative) {
              switch (this.currentLevel) {
                case Level.Level1:
                  translationId = level1.translationId;
                  break;
                case Level.Level2:
                  translationId = level2.translationId;
                  break;
                case Level.Level3:
                  translationId = level3.translationId;
                  break;
                default:
                  translationId = level4.translationId;
                  break;
              }

              return;
            }
          });
        });
      });
    });

    return translationId;
  }

  getLanguages(): Array<Languages> {
    return toPairs(Languages).map((x) => x[1]);
  }

  getLevels(): Array<Level> {
    return filter(
      Object.keys(Level),
      (x) => !Number.isInteger(Number.parseInt(x))
    ).map((x) => Level[x]);
  }

  languageChanged(event: any): void {
    this.translationService.language = event.detail.value;

    // I'am hacking right here officer
    // -> Update Level-Select-Translation on language change
    const lastLevel = this.currentLevel;
    this.currentLevel = undefined;
    setTimeout(() => {
      this.currentLevel = lastLevel;
    }, 100);
  }

  levelChanged(event: any): void {
    this.currentLevel = event.detail.value;
    this.onSubmit();
  }
}
