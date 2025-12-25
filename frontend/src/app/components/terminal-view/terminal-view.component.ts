import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-terminal-view',
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
  templateUrl: './terminal-view.component.html',
  styleUrl: './terminal-view.component.scss' // Changed from styleUrls to styleUrl to match existing file
})
export class TerminalViewComponent implements AfterViewChecked {
  @ViewChild('inputField') inputField!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Initial welcome message simulating a Mainframe boot
  outputLines: string[] = [
    'NOCTIL MAINFRAME SYSTEM [Version 4.0.1]',
    '(c) 1985 Noctil Corp. All rights reserved.',
    ' ',
    'Connecting to DB2 Database... SUCCESS.',
    'User detected: ADMIN',
    'Type "HELP" for a list of commands.',
    ' '
  ];

  // Auto-scroll to bottom whenever output changes
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  // Handle the "Enter" key
  handleInput(event: any) {
    const command = event.target.value.trim();

    // 1. Add the command to history
    this.outputLines.push(`C:\\USERS\\ADMIN> ${command}`);

    // 2. Process logic
    this.processCommand(command.toLowerCase());

    // 3. Clear input
    event.target.value = '';
  }

  processCommand(cmd: string) {
    switch (cmd) {
      case 'help':
        this.outputLines.push(
          'AVAILABLE COMMANDS:',
          '- LIST: List all artists',
          '- STATUS: Check system status',
          '- CLEAR: Clear terminal screen',
          '- MIGRATE: Initiate System Migration (Phase 2)'
        );
        break;
      case 'clear':
        this.outputLines = [];
        break;
      case 'status':
        this.outputLines.push('SYSTEM: STABLE', 'MEMORY: 64KB OK', 'MIGRATION_PENDING: TRUE');
        break;
      case 'list':
        this.outputLines.push('FETCHING RECORDS...', '1. PINK FLOYD', '2. DAFT PUNK', '3. RADIOHEAD');
        break;
      default:
        if (cmd !== '') {
          this.outputLines.push(`ERROR: Command '${cmd}' not recognized.`);
        }
    }
  }

  // Ensure clicking anywhere focuses the input
  focusInput() {
    this.inputField.nativeElement.focus();
  }
}