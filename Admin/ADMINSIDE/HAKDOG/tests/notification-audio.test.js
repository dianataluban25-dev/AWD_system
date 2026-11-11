import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNotificationAudio } from '../resources/js/notification-audio.js';

test('Notification sound waits for unlock and plays two short tones',async()=>{
    let starts=0,stops=0;
    const context={state:'suspended',currentTime:1,destination:{},async resume(){this.state='running';},
        createOscillator(){return {frequency:{value:0},connect(){},disconnect(){},start(){starts++;},stop(){stops++;}};},
        createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}};
    const audio=createNotificationAudio(()=>context);
    assert.equal(audio.play(),false);assert.equal(await audio.unlock(),true);
    assert.equal(audio.play(),true);assert.equal(starts,2);assert.equal(stops,2);
});
test('Unavailable browser audio does not break notifications',async()=>{
    const audio=createNotificationAudio(()=>null);
    assert.equal(await audio.unlock(),false);assert.equal(audio.play(),false);
});
