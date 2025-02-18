import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { QuesdownComponent } from './quesdown/quesdown.component';
const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'quesdown', component: QuesdownComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
