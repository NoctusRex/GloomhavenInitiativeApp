import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { filter, toPairs } from 'lodash-es';
import { Languages } from 'src/app/consts/languages.const';
import {
  LANGUE_STORAGE_KEY,
  LEVEL_STORAGE_KEY,
} from 'src/app/consts/storage-keys.const';
import { InitiativesConfigurationService } from 'src/app/services/initatives-configuration.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TranslationService } from 'src/app/services/translation.service';
import { Form } from '../../models/form.model';

export enum Level {
  NONE = 0,
  LEVEL1 = 1,
  LEVEL2 = 2,
  LEVEL3 = 3,
  LEVEL4 = 4,
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
    protected translationService: TranslationService,
    protected localStorageService: LocalStorageService
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

    this.form.formGroup.valueChanges.subscribe(() => {
      this.updateInitiative();
    });

    this.currentInitative = undefined;

    this.translationService.language =
      this.localStorageService.getItem<Languages>(
        LANGUE_STORAGE_KEY,
        this.translationService.language
      );
    this.currentLanguage = this.translationService.language;

    this.currentLevel = this.localStorageService.getItem(
      LEVEL_STORAGE_KEY,
      Level.LEVEL2
    );
  }

  getInitiativeTranslationId(initative: number): string {
    let translationId: string = undefined;
    if (this.currentLevel === Level.NONE) return translationId;

    this.initiativesConfigurationService.configuration.forEach((level1) => {
      if (translationId) return;

      level1.values.forEach((level2) => {
        if (translationId) return;

        level2.values.forEach((level3) => {
          if (translationId) return;

          level3.values.forEach((level4) => {
            if (level4.value === initative) {
              switch (this.currentLevel) {
                case Level.LEVEL1:
                  translationId = level1.translationId;
                  break;
                case Level.LEVEL2:
                  translationId = level2.translationId;
                  break;
                case Level.LEVEL3:
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
    )
      .filter((x) => x !== 'NONE')
      .map((x) => Level[x]);
  }

  updateInitiative(): void {
    if (!this.form.get('initiative')) {
      this.currentInitative = undefined;
    } else {
      if (!this.form.canSubmit()) return;

      this.currentInitative = this.getInitiativeTranslationId(
        this.form.get('initiative')
      );
    }
  }

  languageChanged(event: any): void {
    this.translationService.language = event.detail.value;
    this.localStorageService.setItem(
      LANGUE_STORAGE_KEY,
      this.translationService.language
    );

    // I'am hacking right here officer
    // -> Update Level-Select-Translation on language change
    const lastLevel = this.currentLevel;
    this.currentLevel = Level.NONE;

    setTimeout(() => {
      this.currentLevel = lastLevel;
    }, 100);
  }

  levelChanged(event: any): void {
    this.currentLevel = event.detail.value;
    this.localStorageService.setItem(LEVEL_STORAGE_KEY, this.currentLevel);

    this.updateInitiative();
  }
}
