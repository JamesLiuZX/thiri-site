/**
 * Inlined into <head> by the root layout and run before first paint.
 *
 * It clears `no-js`, then adds `.is-in` to every `.reveal`, `.rise`, `.feed`
 * and `.observe` element as it scrolls into view. The CSS in globals.css does
 * the rest, so the components that use it stay server components and nothing
 * waits on hydration. `__revealScan` lets client navigations ask for a rescan
 * (components/reveal-rescan.tsx).
 *
 * Kept as a string so it ships verbatim.
 */
export const REVEAL_BOOTSTRAP = `(function(){
var d=document,r=d.documentElement,q='.reveal:not(.is-in),.rise:not(.is-in),.feed:not(.is-in),.observe:not(.is-in)';
r.classList.remove('no-js');
if(!('IntersectionObserver' in window)){r.classList.add('reveal-all');return}
var io=new IntersectionObserver(function(entries){
for(var i=0;i<entries.length;i++){var e=entries[i];
if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}
},{rootMargin:'0px 0px -12% 0px'});
var queued=0;
function scan(){queued=0;var els=d.querySelectorAll(q);for(var i=0;i<els.length;i++){io.observe(els[i])}}
function schedule(){if(queued)return;queued=1;requestAnimationFrame(scan)}
window.__revealScan=schedule;
schedule();
d.addEventListener('DOMContentLoaded',schedule);
window.addEventListener('load',schedule);
})();`
