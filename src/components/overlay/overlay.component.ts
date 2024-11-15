import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-overlay',
  standalone: true,
  imports: [],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css'
})
export class OverlayComponent {
  @Input() message!: string;
  @Input() type!: string;
  @Output() closeBtn = new EventEmitter();

  closeOverlay() {
    this.closeBtn.emit()
  }
}
