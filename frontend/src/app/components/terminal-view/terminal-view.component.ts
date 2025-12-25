import { Component, ElementRef, ViewChild, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistService, Artist } from '../../services/artist.service';

@Component({
  selector: 'app-terminal-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terminal-view.component.html',
  styleUrls: ['./terminal-view.component.scss']
})
export class TerminalViewComponent implements AfterViewChecked {
  @ViewChild('inputField') inputField!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private artistService = inject(ArtistService);

  outputLines: string[] = [
    'MAX MUSIC MAINFRAME SYSTEM [Version 4.5.0]',
    '(c) 1985 Max Music Corp. All rights reserved.',
    ' ',
    'User detected: ADMIN',
    'Type "HELP" for command list.',
    ' '
  ];

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  handleInput(event: any) {
    const rawInput = event.target.value.trim();
    if (!rawInput) return;

    this.outputLines.push(`C:\\USERS\\ADMIN> ${rawInput}`);

    // Split input into COMMAND and ARGUMENT (e.g., "LIST 10" -> cmd="list", arg="10")
    const parts = rawInput.split(' ');
    const command = parts[0].toLowerCase();
    const argument = parts.slice(1).join(' ').toLowerCase(); // Rejoin rest of string

    this.processCommand(command, argument);
    event.target.value = '';
  }

  processCommand(cmd: string, arg: string) {
    switch (cmd) {
      case 'help':
        this.outputLines.push(
          'AVAILABLE COMMANDS:',
          '- LIST [N]     : List records (e.g. "LIST 10" for top 10, or "LIST" for all)',
          '- SEARCH [TXT] : Find artist by name (e.g. "SEARCH pink")',
          '- FILTER [GNR] : Filter by genre (e.g. "FILTER rock")',
          '- CLEAR        : Clear screen'
        );
        break;

      case 'clear':
        this.outputLines = [];
        break;

      case 'list':
      case 'search':
      case 'filter':
        this.fetchAndProcessData(cmd, arg);
        break;

      default:
        this.outputLines.push(`ERROR: Command '${cmd}' not recognized.`);
    }
  }

  // Unified method to fetch data and apply logic
  fetchAndProcessData(cmd: string, arg: string) {
    this.outputLines.push('ACCESSING DATA CORE...');

    this.artistService.getArtists().subscribe({
      next: (allArtists) => {
        let results: Artist[] = [];

        // --- LOGIC ENGINE ---
        if (cmd === 'list') {
          // If argument is a number, limit results. If empty, show all.
          const limit = arg ? parseInt(arg) : allArtists.length;

          if (isNaN(limit)) {
            this.outputLines.push('ERROR: INVALID NUMBER FORMAT.');
            return;
          }
          results = allArtists.slice(0, limit);

        } else if (cmd === 'search') {
          if (!arg) { this.outputLines.push('ERROR: PLEASE SPECIFY SEARCH TERM.'); return; }
          results = allArtists.filter(a => a.name.toLowerCase().includes(arg));

        } else if (cmd === 'filter') {
          if (!arg) { this.outputLines.push('ERROR: PLEASE SPECIFY GENRE.'); return; }
          results = allArtists.filter(a => a.genre.toLowerCase().includes(arg));
        }

        // --- RENDER ---
        setTimeout(() => {
          if (results.length === 0) {
            this.outputLines.push('NO RECORDS FOUND.');
          } else {
            this.renderTable(results);
          }
        }, 300); // Small "processing" delay
      },
      error: () => {
        this.outputLines.push('CRITICAL ERROR: DATABASE CONNECTION LOST.');
      }
    });
  }

  // Helper to draw the ASCII table
  renderTable(data: Artist[]) {
    this.outputLines.push(' ');
    this.outputLines.push('ID  | ARTIST NAME         | GENRE            | STREAMS');
    this.outputLines.push('----|---------------------|------------------|---------');

    data.forEach(artist => {
      const id = (artist.id || 0).toString().padEnd(3, ' ');
      // Truncate name if too long to prevent table breaking
      const name = (artist.name.length > 19 ? artist.name.substring(0, 18) + '.' : artist.name).padEnd(19, ' ');
      const genre = (artist.genre.length > 16 ? artist.genre.substring(0, 15) + '.' : artist.genre).padEnd(16, ' ');
      const streams = artist.streams;

      this.outputLines.push(`${id} | ${name} | ${genre} | ${streams}`);
    });

    this.outputLines.push(' ');
    this.outputLines.push(`QUERY COMPLETE. ${data.length} RECORDS DISPLAYED.`);
  }

  focusInput() {
    this.inputField.nativeElement.focus();
  }
}