class CollectionTabs extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.tabButtons = this.querySelectorAll('.navigation-item');
    this.tabContents = this.querySelectorAll('.collection-tabs-list');

    // Initialize first tab as active if none are active
    if (this.tabButtons.length > 0) {
      const hasActiveTab = Array.from(this.tabButtons).some(tab => tab.classList.contains('active'));
      if (!hasActiveTab) {
        this.tabButtons[0].classList.add('active');
        if (this.tabContents[0]) {
          this.tabContents[0].classList.add('active');
        }
      }
    }

    // Set up accessibility attributes
    this.tabButtons.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
      tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
    });

    this.tabContents.forEach((content, index) => {
      content.setAttribute('role', 'tabpanel');
      content.setAttribute('aria-hidden', content.classList.contains('active') ? 'false' : 'true');
    });

    this.tabButtons.forEach((button, index) => {
      button.addEventListener('click', (e) => this.switchTab(e, index));
      button.addEventListener('keydown', (e) => this.handleKeydown(e, index));
    });
  }

  switchTab(e, index) {
    e.preventDefault();
    
    // Remove active class from all tabs and contents
    this.tabButtons.forEach(tab => tab.classList.remove('active'));
    this.tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab and corresponding content
    // Ensure we're matching tabs to content in left-to-right order
    this.tabButtons[index].classList.add('active');
    if (this.tabContents[index]) {
      this.tabContents[index].classList.add('active');
    }

    // Update ARIA attributes and tabindex for accessibility
    this.tabButtons.forEach((tab, i) => {
      tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
      tab.setAttribute('tabindex', i === index ? '0' : '-1');
    });

    this.tabContents.forEach((content, i) => {
      content.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });

    // Focus the active tab for keyboard navigation only if not triggered by arrow keys
    if (e.type !== 'keydown' || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) {
      this.tabButtons[index].focus();
    }
  }

  handleKeydown(e, index) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.switchTab(e, index);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      // Navigate left to right through tabs
      const direction = e.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (index + direction + this.tabButtons.length) % this.tabButtons.length;
      this.tabButtons[nextIndex].focus();
      this.switchTab(e, nextIndex);
    }
  }
}

customElements.define('collection-tabs', CollectionTabs);
