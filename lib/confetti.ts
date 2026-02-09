/**
 * Confetti celebration utility (Phase 51)
 * Lightweight confetti animation for celebrating user achievements
 */

export function triggerConfetti() {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfettiPiece(color: string) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-20px';
    confetti.style.opacity = '1';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '2px';
    
    document.body.appendChild(confetti);
    
    const fallDuration = 3000 + Math.random() * 2000;
    const startTime = Date.now();
    
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / fallDuration;
        
        if (progress < 1) {
            const yPos = progress * window.innerHeight;
            const xOffset = Math.sin(progress * Math.PI * 4) * 100;
            confetti.style.top = yPos + 'px';
            confetti.style.left = (parseFloat(confetti.style.left) + xOffset * 0.01) + 'px';
            confetti.style.opacity = String(1 - progress);
            confetti.style.transform = `rotate(${progress * 720}deg)`;
            requestAnimationFrame(animate);
        } else {
            confetti.remove();
        }
    };
    
    requestAnimationFrame(animate);
}
