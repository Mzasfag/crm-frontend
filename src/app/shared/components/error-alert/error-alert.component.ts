import { Component, input } from '@angular/core';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-error-alert',
  imports: [MessageModule],
  templateUrl: './error-alert.component.html',
  styleUrl: './error-alert.component.css',
})
export class ErrorAlertComponent {

message = input<string>('')

}
