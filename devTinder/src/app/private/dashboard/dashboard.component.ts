import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
@ViewChildren('card', { read: ElementRef }) cards!: QueryList<ElementRef>;

  users = [
    { name: 'Aarav Sharma', designation: 'Frontend Developer', about: 'Angular | TypeScript', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Priya Patel', designation: 'UI/UX Designer', about: 'Minimal design lover', image: 'https://randomuser.me/api/portraits/women/45.jpg' },
    { name: 'Rohan Mehta', designation: 'Backend Engineer', about: 'Node.js & Spring', image: 'https://randomuser.me/api/portraits/men/12.jpg' }
  ];

  // drag state
  private startX = 0;
  private currentX = 0;
  private isDragging = false;
  showLike = false;
  showNope = false;

  ngAfterViewInit() {
    // We intentionally do NOT attach global listeners to all cards.
    // We'll let pointer events in the template call start/move/end functions,
    // but always enforce "only top card" in the handlers.
  }

  startSwipe(event: PointerEvent | TouchEvent | MouseEvent, index: number) {
    const topIndex = this.users.length - 1; 
    if (index !== topIndex) return;
    const clientX = this.getClientX(event);
    this.startX = clientX;
    this.currentX = clientX;
    this.isDragging = true;
    this.showLike = false;
    this.showNope = false;
    if ((event as PointerEvent).preventDefault) (event as PointerEvent).preventDefault();
  }

  moveSwipe(event: PointerEvent | TouchEvent | MouseEvent, index: number) {
    if (!this.isDragging) return;
    const topIndex = this.users.length - 1;
    if (index !== topIndex) return;
    const clientX = this.getClientX(event);
    const diff = clientX - this.startX;
    this.currentX = clientX;
    if (Math.abs(diff) < 8) {
      return;
    }
    const cardEl = this.getTopCardElement();
    if (!cardEl) return;
    cardEl.style.transition = 'none';
    cardEl.style.transform = `translateX(${diff}px) rotate(${diff / 15}deg)`
    this.showLike = diff > 120;
    this.showNope = diff < -120;
  }

  endSwipe(event: PointerEvent | TouchEvent | MouseEvent, index: number) {
    if (!this.isDragging) return;
    this.isDragging = false;
    const topIndex = this.users.length - 1;
    if (index !== topIndex) return;
    const diff = this.currentX - this.startX;
    const cardEl = this.getTopCardElement();
    if (!cardEl) return;
    cardEl.style.transition = 'transform 0.45s cubic-bezier(.2,.9,.2,1), opacity 0.45s ease';
    const threshold = 150;
    if (Math.abs(diff) > threshold) {
      const direction = diff > 0 ? 1 : -1;
      cardEl.style.transform = `translateX(${direction * 1200}px) rotate(${direction * 45}deg)`;
      cardEl.style.opacity = '0';
      setTimeout(() => {
        this.users.splice(topIndex, 1);
        this.showLike = false;
        this.showNope = false;
      }, 420);
    } else {
      cardEl.style.transform = 'translateX(0px) rotate(0deg)';
      this.showLike = false;
      this.showNope = false;
    }
  }

  private getClientX(event: any): number {
    if (event instanceof PointerEvent || event.type?.startsWith('mouse')) {
      return (event as PointerEvent).clientX;
    }
    if (event.touches && event.touches.length) {
      return event.touches[0].clientX;
    }
    if (event.changedTouches && event.changedTouches.length) {
      return event.changedTouches[0].clientX;
    }
    return (event as any).clientX || 0;
  }

  private getTopCardElement(): HTMLElement | null {
    const cardArray = this.cards.toArray();
    if (!cardArray.length) return null;
    const topElRef = cardArray[cardArray.length - 1];
    return topElRef ? (topElRef.nativeElement as HTMLElement) : null;
  }

  swipeLeftButton() {
    const topEl = this.getTopCardElement();
    if (!topEl) return;
    topEl.style.transition = 'transform 0.45s ease, opacity 0.45s ease';
    topEl.style.transform = 'translateX(-1200px) rotate(-45deg)';
    topEl.style.opacity = '0';
    setTimeout(() => {
      this.users.pop();
      this.showNope = false;
    }, 420);
  }

  swipeRightButton() {
    const topEl = this.getTopCardElement();
    if (!topEl) return;
    topEl.style.transition = 'transform 0.45s ease, opacity 0.45s ease';
    topEl.style.transform = 'translateX(1200px) rotate(45deg)';
    topEl.style.opacity = '0';
    setTimeout(() => {
      this.users.pop();
      this.showLike = false;
    }, 420);
  }
}