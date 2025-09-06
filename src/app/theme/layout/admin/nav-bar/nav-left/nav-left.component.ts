import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-nav-left',
  imports: [FormsModule, CommonModule],
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent {
  @Output() NavCollapsedMob = new EventEmitter();

  searchQuery = '';
  searchSessionId = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: any[] = [];
  loading = false;

  // Track whether user has actually submitted search
  searchSubmitted = false;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private searchService: SearchService) {}

  // Only used to clear previous results on input change
  onInputChange() {
    this.searchSubmitted = false; // reset submitted flag while typing
  }

  submitSearch() {
    if (!this.searchQuery.trim() && !this.searchSessionId.trim()) {
      alert('Please enter a keyword or session ID to search.');
      return;
    }

    this.searchSubmitted = true;
    this.loading = true;
    this.results = [];

    this.searchService.search(this.searchQuery, this.searchSessionId).subscribe({
      next: (res) => {
        this.results = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.loading = false;
      }
    });
  }

  // Clear everything
  clearSearch() {
    this.searchQuery = '';
    this.searchSessionId = '';
    this.results = [];
    this.searchSubmitted = false;
  }
}
