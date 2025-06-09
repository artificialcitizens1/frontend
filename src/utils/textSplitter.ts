export class TextSplitter {
  private element: HTMLElement;
  private options: { splitTypeTypes: string };

  constructor(element: HTMLElement, options: { splitTypeTypes: string }) {
    this.element = element;
    this.options = options;
  }

  getChars(): HTMLElement[] {
    const text = this.element.textContent || '';
    const chars = text.split('');
    
    // Clear the element
    this.element.textContent = '';
    
    // Create spans for each character
    return chars.map(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      this.element.appendChild(span);
      return span;
    });
  }

  getWords(): HTMLElement[] {
    const text = this.element.textContent || '';
    const words = text.split(' ');
    
    // Clear the element
    this.element.textContent = '';
    
    // Create spans for each word
    return words.map(word => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.display = 'inline-block';
      this.element.appendChild(span);
      return span;
    });
  }
} 