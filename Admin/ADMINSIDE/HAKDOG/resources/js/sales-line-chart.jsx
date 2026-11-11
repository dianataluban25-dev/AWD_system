import React, { useState } from 'react';
const peso=value=>new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(value);
function manilaDay(value) {
 const parts=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Manila'}).formatToParts(new Date(value));
 const part=type=>parts.find(p=>p.type===type).value;
 return `${part('year')}-${part('month')}-${part('day')}`;
}
export function SalesLineChart({ orders }) {
 const [days,setDays]=useState(7), totals=new Map();
 orders.forEach(order=>{const key=manilaDay(order.paid_at||order.created_at);totals.set(key,(totals.get(key)||0)+order.total);});
 const today=new Date(`${manilaDay(new Date())}T00:00:00Z`);
 const rows=Array.from({length:days},(_,index)=>{const date=new Date(today);date.setUTCDate(date.getUTCDate()-days+1+index);const key=date.toISOString().slice(0,10);return {key,total:totals.get(key)||0,date};});
 const total=rows.reduce((sum,row)=>sum+row.total,0),width=720,height=240,left=74,right=25,top=25,bottom=42;
 const peak=Math.max(100,...rows.map(row=>row.total)), magnitude=10**Math.floor(Math.log10(peak)), max=Math.ceil(peak/magnitude)*magnitude;
 const x=i=>left+i*(width-left-right)/(days-1), y=value=>height-bottom-value/max*(height-top-bottom);
 const points=rows.map((row,i)=>`${x(i)},${y(row.total)}`).join(' ');
 return <section className="sales-line-chart" aria-label="Daily sales trend">
  <div className="sales-trend-header"><div><strong>{peso(total)}</strong><small>Paid sales · Last {days} days</small></div><div className="sales-period" aria-label="Chart period">{[7,30].map(value=><button type="button" key={value} className={days===value?'active':''} aria-pressed={days===value} onClick={()=>setDays(value)}>{value} days</button>)}</div></div>
  <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Daily paid sales over the last ${days} days`}>
   <title>Daily sales in Philippine pesos</title><desc>{rows.map(row=>`${row.key}: ${peso(row.total)}`).join('; ')}</desc>
   <defs><linearGradient id="sales-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#08752f" stopOpacity=".16"/><stop offset="100%" stopColor="#08752f" stopOpacity=".01"/></linearGradient></defs>
   {[0,.25,.5,.75,1].map(fraction=><g key={fraction}><line x1={left} x2={width-right} y1={y(max*fraction)} y2={y(max*fraction)} stroke="#e7ede7" strokeDasharray={fraction?'3 6':undefined}/><text x={left-12} y={y(max*fraction)+4} textAnchor="end" className="sales-axis">{peso(max*fraction)}</text></g>)}
   <polygon points={`${left},${y(0)} ${points} ${width-right},${y(0)}`} fill="url(#sales-area)"/>
   <polyline points={points} fill="none" stroke="#08752f" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>
   {rows.map((row,i)=><g key={row.key}><circle cx={x(i)} cy={y(row.total)} r={row.total?4:2} fill={row.total?'#08752f':'#94b49a'} stroke="white" strokeWidth="1.5"><title>{row.key}: {peso(row.total)}</title></circle>{(days===7||i%5===0||i===days-1)&&<text x={x(i)} y={height-15} textAnchor="middle" className="sales-axis">{row.date.toLocaleDateString('en-PH',{month:'short',day:'numeric',timeZone:'UTC'})}</text>}</g>)}
  </svg>{!total&&<p className="sales-chart-caption">No paid sales in this period.</p>}
 </section>;
}
