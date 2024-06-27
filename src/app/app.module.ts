import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccordionComponent } from './accordion/accordion.component';
import { ChartsComponent } from './charts/charts.component';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CountComponent } from './count/count.component';
import { StusurveyComponent } from './stusurvey/stusurvey.component';
import { SurtakenComponent } from './surtaken/surtaken.component';
import { QuestionComponent } from './question/question.component';
import {MatNativeDateModule, ThemePalette} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SurresponseComponent } from './surresponse/surresponse.component';
import { TabsComponent } from './tabs/tabs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { QuesdownComponent } from './quesdown/quesdown.component';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule,MatAccordion} from '@angular/material/expansion';
import { DemoComponent } from './demo/demo.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SurveysComponent } from './surveys/surveys.component';
import { SingleresComponent } from './singleres/singleres.component';
import { BulkresComponent } from './bulkres/bulkres.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SpocComponent } from './spoc/spoc.component';
import { MatOption } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { StudentsComponent } from './students/students.component';
import { SingleDialogComponent } from './single-dialog/single-dialog.component';
import { ErrordialogComponent } from './errordialog/errordialog.component';
@NgModule({
  declarations: [
    AppComponent,
    AccordionComponent,
    ChartsComponent,
    CountComponent,
    StusurveyComponent,
    SurtakenComponent,
    QuestionComponent,
    SurresponseComponent, 
    TabsComponent, QuesdownComponent, DemoComponent, SurveysComponent,SingleresComponent,  BulkresComponent, SpocComponent, StudentsComponent, SingleDialogComponent, ErrordialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDialogModule,
    AppRoutingModule, NgApexchartsModule,CdkAccordionModule,MatCheckboxModule,FormsModule, MatTabsModule,MatFormFieldModule, MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatAccordion,
    MatInputModule,MatOption,
   
  ],

  providers: [provideHttpClient(withInterceptorsFromDi())],

  bootstrap: [AppComponent]
})
export class AppModule { }
