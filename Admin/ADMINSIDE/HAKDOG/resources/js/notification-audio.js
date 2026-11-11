export function createNotificationAudio(createContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return AudioContext ? new AudioContext() : null;
}) {
    let context;
    return {
        async unlock() {
            try { context ||= createContext(); if (context?.state === 'suspended') await context.resume(); return context?.state === 'running'; }
            catch { return false; }
        },
        play() {
            if (context?.state !== 'running') return false;
            try {
                const now=context.currentTime;
                [660,880].forEach((frequency,index)=>{
                    const oscillator=context.createOscillator(), gain=context.createGain(), start=now+index*.16;
                    oscillator.type='sine'; oscillator.frequency.value=frequency;
                    gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.12,start+.015);
                    gain.gain.exponentialRampToValueAtTime(.001,start+.3);
                    oscillator.connect(gain);gain.connect(context.destination);
                    oscillator.start(start);oscillator.stop(start+.32);
                    oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};
                });
                return true;
            } catch {return false;}
        },
    };
}
export const notificationAudio=createNotificationAudio();
