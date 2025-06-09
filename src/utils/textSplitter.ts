export class TextSplitter {
  private element: HTMLElement;

  constructor(element: HTMLElement, _options: { splitTypeTypes: string }) {
    this.element = element;
    // options parameter is kept for future extensibility but not currently used
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