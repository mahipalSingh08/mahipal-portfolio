import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';

interface ReactionData {
    reaction: string;
    count: number;
    email: string[];
    totalCount: number;
}

@Component({
    selector: 'app-reaction',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reaction.html',
    styleUrl: './reaction.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactionComponent implements OnInit {
    private apiService = inject(ApiService);
    private cdr = inject(ChangeDetectorRef);
    reactions: ReactionData[] = [];
    isLoading = true;
    errorMessage: string | null = null;

    ngOnInit(): void {
        this.loadReactions();
    }

    private loadReactions(): void {
        console.log('Loading reactions...');
        this.isLoading = true;
        this.errorMessage = null;
        this.cdr.markForCheck();
        
        this.apiService.getReactions().subscribe({
            next: (reactions) => {
                this.reactions = reactions;
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (error) => {
                console.error('Error loading reactions:', error);
                this.errorMessage = error.message || 'Failed to load reactions';
                this.isLoading = false;
                this.cdr.markForCheck();
            }
        });
    }

    getReactionEmoji(reaction: string): string {
        const emojiMap: { [key: string]: string } = {
            'Like': '👍',
            'Smile': '😊',
            'Appreciate': '🙏',
            'Celebrate': '🎉',
            'Cheer': '📣'
        };
        return emojiMap[reaction] || '👍';
    }
}
