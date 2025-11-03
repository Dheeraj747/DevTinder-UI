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

  // index is the index passed from the template for this card
  startSwipe(event: PointerEvent | TouchEvent | MouseEvent, index: number) {
    const topIndex = this.users.length - 1; 
    if (index !== topIndex) return;

    // unify pointer coordinates
    const clientX = this.getClientX(event);
    this.startX = clientX;
    this.currentX = clientX;
    this.isDragging = true;

    // reset badges
    this.showLike = false;
    this.showNope = false;

    // prevent text selection / default behavior
    if ((event as PointerEvent).preventDefault) (event as PointerEvent).preventDefault();
  }

  moveSwipe(event: PointerEvent | TouchEvent | MouseEvent, index: number) {
    if (!this.isDragging) return;

    const topIndex = this.users.length - 1;
    if (index !== topIndex) return;

    const clientX = this.getClientX(event);
    const diff = clientX - this.startX;
    this.currentX = clientX;

    // ignore jitter / micro moves
    if (Math.abs(diff) < 8) {
      // keep stable; do not update transform or badges
      return;
    }

    // find the top card DOM element
    const cardEl = this.getTopCardElement();
    if (!cardEl) return;

    // update transform without transition so it follows pointer
    cardEl.style.transition = 'none';
    cardEl.style.transform = `translateX(${diff}px) rotate(${diff / 15}deg)`;

    // show badges only for significant movement
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

    // enable smooth transition for snap/swipe-away
    cardEl.style.transition = 'transform 0.45s cubic-bezier(.2,.9,.2,1), opacity 0.45s ease';

    // threshold: must move sufficiently far to count as swipe
    const threshold = 150;

    if (Math.abs(diff) > threshold) {
      const direction = diff > 0 ? 1 : -1;
      cardEl.style.transform = `translateX(${direction * 1200}px) rotate(${direction * 45}deg)`;
      cardEl.style.opacity = '0';

      // remove card from array after animation
      setTimeout(() => {
        // remove the top user
        this.users.splice(topIndex, 1);
        // reset badges for the next top card
        this.showLike = false;
        this.showNope = false;
      }, 420);
    } else {
      // not far enough -> snap back
      cardEl.style.transform = 'translateX(0px) rotate(0deg)';
      this.showLike = false;
      this.showNope = false;
    }
  }

  // helper to unify event coordinate extraction
  private getClientX(event: any): number {
    if (event instanceof PointerEvent || event.type?.startsWith('mouse')) {
      return (event as PointerEvent).clientX;
    }
    // touch event
    if (event.touches && event.touches.length) {
      return event.touches[0].clientX;
    }
    if (event.changedTouches && event.changedTouches.length) {
      return event.changedTouches[0].clientX;
    }
    // fallback
    return (event as any).clientX || 0;
  }

  // helper to get the current top card DOM element
  private getTopCardElement(): HTMLElement | null {
    // cards QueryList is in DOM order: the first QueryList item corresponds to the first element in DOM.
    // We expect top card to be the last in visual stack (z-index = users.length - 1).
    const cardArray = this.cards.toArray();
    if (!cardArray.length) return null;

    // find card that corresponds to the last user — index mapping assumes *ngFor order matches users array
    // The top card will be the last rendered element (cardArray[cardArray.length - 1])
    const topElRef = cardArray[cardArray.length - 1];
    return topElRef ? (topElRef.nativeElement as HTMLElement) : null;
  }

  // optional programmatic swipes for buttons
  swipeLeftButton() {
    const topEl = this.getTopCardElement();
    if (!topEl) return;
    topEl.style.transition = 'transform 0.45s ease, opacity 0.45s ease';
    topEl.style.transform = 'translateX(-1200px) rotate(-45deg)';
    topEl.style.opacity = '0';
    setTimeout(() => {
      this.users.pop(); // remove top
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
      this.users.pop(); // remove top
      this.showLike = false;
    }, 420);
  }
}