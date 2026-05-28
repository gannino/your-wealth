import{c as e,l as t,o as n,s as r,t as i}from"./index-ZKTtEZpo.js";import{t as a}from"./sanitizeHtml-CU0ZG3vK.js";var o=t(e(),1),s=i(),c=[{id:`intro`,type:`intro`,title:`Welcome to Module 2: Myth-Busting`,subtitle:`Shatter the 9 Financial Myths That Destroy Wealth`},{id:`nine-myths`,type:`content`,title:`The 9 Financial Myths`,subtitle:`What the Wall Street machine wants you to believe`},{id:`fee-destruction`,type:`content`,title:`The Fee Destruction Formula`,subtitle:`How tiny fees compound into massive losses`},{id:`myth-quiz`,type:`quiz`,title:`Test Your Knowledge`,question:`Which statement about mutual fund fees is TRUE?`,options:[{value:`a`,label:`A 1% fee is negligible`,feedback:`False! A 1% fee can reduce wealth by 30% over 40 years.`,isCorrect:!1},{value:`b`,label:`Index funds have lower fees`,feedback:`Correct! Index funds average 0.1-0.5%, active funds 1-2%.`,isCorrect:!0},{value:`c`,label:`High fees mean better performance`,feedback:`False! High-fee funds consistently underperform.`,isCorrect:!1},{value:`d`,label:`Fees only charged on profits`,feedback:`False! Fees charged on all assets regardless of performance.`,isCorrect:!1}],correctAnswer:`b`},{id:`index-scenario`,type:`scenario`,title:`Investment Decision`,scenario:`Your 401(k) offers two options:

Option A: Active fund with 1.5% fee
Option B: Index fund with 0.1% fee

You have 35 years until retirement.`,question:`What do you choose?`,options:[{value:`active`,label:`Choose active fund`,feedback:`Past performance ≠ future results. The 1.4% fee difference could cost you 30-40% of your wealth.`,isCorrect:!1},{value:`index`,label:`Choose index fund`,feedback:`Wise choice! Avoiding the fee drag could mean 2-3x more wealth at retirement.`,isCorrect:!0},{value:`split`,label:`Split between both`,feedback:`Half your money still suffers high fees. Consider 100% index fund.`,isCorrect:!1}],correctAnswer:`index`},{id:`reflection`,type:`reflection`,title:`Personal Reflection`,content:`Think about your current investments. Do you know what fees you're paying?

Reflect on:
- What surprised you about fees?
- Will you check your investment fees?
- What action will you take?`},{id:`complete`,type:`content`,title:`Module 2 Complete!`,subtitle:`You're now armed with the truth about fees`}];function l(e){return{"nine-myths":`
<h2>The 9 Financial Myths Tony Robbins Identified:</h2>
<ol class="list-decimal ml-8 space-y-2">
<li><strong>"Investing is complicated"</strong> - Myth! Simple index funds outperform 80% of pros.</li>
<li><strong>"Advisors are fiduciaries"</strong> - Most are brokers who put commissions first.</li>
<li><strong>"Fees don't matter"</strong> - A 2% fee can cost you 65% of your wealth.</li>
<li><strong>"My fund beat the market"</strong> - Past performance NEVER predicts results.</li>
<li><strong>"High fees = better service"</strong> - You're paying for marketing, not performance.</li>
</ol>
`,"fee-destruction":`
<h2>The Fee Destruction Formula</h2>
<p>The math is brutal: <strong>Higher fees = exponentially less wealth.</strong></p>
<p>Starting with $100,000, earning 7% annually over 40 years:</p>
<ul class="list-disc ml-8 space-y-1">
<li><strong>0.1% fee</strong> → $1,497,000 final wealth</li>
<li><strong>1% fee</strong> → $1,075,000 (lose $422,000!)</li>
<li><strong>2% fee</strong> → $747,000 (lose $750,000!)</li>
</ul>
<p class="mt-4 text-primary-teal font-semibold">A 1% fee difference = HALF your wealth gone.</p>
`,complete:`
<h2 class="text-green-400">🎉 Congratulations!</h2>
<p>You've completed Module 2: Myth-Busting.</p>
<h3 class="mt-4">Key Takeaways:</h3>
<ul class="list-disc ml-8 space-y-1">
<li>You know the 9 financial myths that destroy wealth</li>
<li>You understand the Fee Destruction Formula</li>
<li>You can spot fee traps in investment products</li>
<li>You know index funds outperform most active funds</li>
</ul>
`}[e.id]||e.content||``}function u(){let e=r(),{startModule:t,recordScreenProgress:i,completeModule:u}=n(),[d,f]=(0,o.useState)(0),[p,m]=(0,o.useState)(null),[h,g]=(0,o.useState)(!1),_=c[d],v=c.length,y=`module-2-mythbusting`;(0,o.useEffect)(()=>{t(y)},[y,t]);let b=e=>{m(e),g(!0)},x=()=>{i(y,_.id,v);let t=d+1;t<v?(f(t),m(null),g(!1)):(u(y),e(`/training/hub`))},S=()=>{d>0?(f(d-1),m(null),g(!1)):e(`/training/hub`)},C=(d+1)/v*100;return(0,s.jsx)(`div`,{className:`min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4`,children:(0,s.jsxs)(`div`,{className:`max-w-4xl mx-auto`,children:[(0,s.jsxs)(`div`,{className:`mb-6`,children:[(0,s.jsxs)(`div`,{className:`flex justify-between text-sm text-gray-400 mb-2`,children:[(0,s.jsx)(`span`,{children:`Progress`}),(0,s.jsxs)(`span`,{children:[Math.round(C),`%`]})]}),(0,s.jsx)(`div`,{className:`w-full bg-dark-bg rounded-full h-2`,children:(0,s.jsx)(`div`,{className:`bg-primary-teal h-2 rounded-full transition-all`,style:{width:`${C}%`}})})]}),(0,s.jsxs)(`div`,{className:`bg-dark-surface border border-dark-border rounded-lg p-8`,children:[_.title&&(0,s.jsx)(`h1`,{className:`text-3xl font-bold text-white mb-2`,children:_.title}),_.subtitle&&(0,s.jsx)(`p`,{className:`text-xl text-primary-teal mb-6`,children:_.subtitle}),(_.type===`content`||_.type===`intro`||_.type===`reflection`)&&(0,s.jsx)(`div`,{className:`text-gray-300 leading-relaxed prose prose-invert max-w-none`,dangerouslySetInnerHTML:a(l(_))}),(_.type===`quiz`||_.type===`scenario`)&&_.options&&(0,s.jsx)(`div`,{className:`mt-8 space-y-3`,children:_.options.map(e=>(0,s.jsx)(`button`,{onClick:()=>b(e.value),disabled:h,className:`w-full text-left px-6 py-4 rounded-lg border transition-all ${p===e.value?h&&e.isCorrect?`bg-green-400/20 border-green-400`:h?`bg-red-400/20 border-red-400`:`bg-primary-teal/20 border-primary-teal`:`bg-dark-bg border-dark-border hover:border-primary-teal`} ${h?`cursor-default`:`hover:bg-primary-teal/10`}`,children:(0,s.jsx)(`span`,{className:`text-gray-200 font-semibold`,children:e.label})},e.value))}),h&&p&&_.options&&(0,s.jsx)(`div`,{className:`mt-6 p-4 rounded-lg border ${p===_.correctAnswer?`bg-green-400/10 border-green-400/30`:`bg-red-400/10 border-red-400/30`}`,children:(0,s.jsx)(`p`,{className:`text-gray-300`,children:_.options.find(e=>e.value===p)?.feedback||``})}),(_.type===`intro`||_.type===`content`||_.type===`quiz`||_.type===`scenario`)&&(0,s.jsxs)(`div`,{className:`flex justify-between items-center mt-8`,children:[(0,s.jsx)(`button`,{onClick:S,className:`px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold`,children:`← Back`}),(0,s.jsxs)(`button`,{onClick:x,disabled:(_.type===`quiz`||_.type===`scenario`)&&!h,className:`px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed`,children:[d===v-1?`Complete`:`Next`,` →`]})]}),_.type===`reflection`&&(0,s.jsxs)(`div`,{className:`flex justify-between items-center mt-8`,children:[(0,s.jsx)(`button`,{onClick:S,className:`px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold`,children:`← Back`}),(0,s.jsx)(`button`,{onClick:x,className:`px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors`,children:`Continue →`})]})]})]})})}export{u as default};
//# sourceMappingURL=Module2-B_lqsoe8.js.map