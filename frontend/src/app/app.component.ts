import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf
import { RouterOutlet } from '@angular/router';
import { TerminalViewComponent } from './components/terminal-view/terminal-view.component';
import { DashboardViewComponent } from './components/dashboard-view/dashboard-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TerminalViewComponent, DashboardViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  // Default to the "Past"
  isLegacyMode = true;

  toggleMode() {
    this.isLegacyMode = !this.isLegacyMode;
  }
}