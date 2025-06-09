import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-question-dialog",
    imports: [CommonModule],
    templateUrl: "./question-dialog.component.html",
    styleUrls: ["./question-dialog.component.css"],
})
export class QuestionDialogComponent {
    @Input() title: string = "Are you sure?";
    @Input() text: string = "Do you want to proceed?";
    @Input() acceptLabel: string = "Accept";
    @Input() cancelLabel: string = "Cancel";

    @Output() accept = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onAccept() {
        this.accept.emit();
    }

    onCancel() {
        this.cancel.emit();
    }
}
