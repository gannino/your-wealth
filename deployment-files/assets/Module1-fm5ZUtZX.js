import{c as e,l as t,o as n,s as r,t as i}from"./index-ZKTtEZpo.js";import{t as a}from"./sanitizeHtml-CU0ZG3vK.js";var o=t(e(),1),s={unshakable:{"ch01-unshakeable.md":`# Chapter 1: The Price of Being Poor

The first step to building your wealth is understanding the true cost of financial struggle. Tony Robbins teaches us that being poor isn't just about money—it's about lost freedom, limited choices, and constant stress.

## Key Takeaways

- Financial freedom equals life freedom
- The 80/20 principle applies to wealth building
- Your psychology drives your financial outcomes`,"ch02-seven-freedom-facts.md":`# Chapter 2: Seven Freedom Facts

Understanding these seven facts transforms how you view market volatility and investment opportunities.

## Key Facts

1. Markets rise more than they fall
2. Bear markets are buying opportunities
3. Time in market beats timing the market
4. Diversification reduces risk
5. Index funds outperform most active managers
6. Fees destroy wealth over time
7. You can create income streams in any market`,"ch03-hidden-fees.md":`# Chapter 3: The Hidden Fees That Destroy Your Wealth

Financial institutions profit from hidden fees that most investors never see.

## The Fee Destruction Formula

Even a 1% difference in fees can cost you hundreds of thousands over your lifetime.`,"ch04-index-funds.md":`# Chapter 4: The Power of Index Funds

Passive investing through index funds has consistently outperformed active management.`,"ch05-bear-market.md":`# Chapter 5: Bear Market Opportunities

When everyone else is selling, smart investors are buying.`,"ch06-core-four.md":`# Chapter 6: The Core Four Principles

Ray Dalio's All Seasons portfolio provides balance across economic conditions.`,"ch09-real-wealth.md":`# Chapter 9: What Is Real Wealth?

True wealth extends beyond money to include health, relationships, and experiences.`},"money-master-the-game":{"ch01-80-20-principle.md":`# Chapter 1: The 80/20 Principle

Tony Robbins discovered that 20% of activities produce 80% of results.

## Application

Focus on the vital few financial decisions that matter most.

## Key Actions

1. Define your financial targets clearly
2. Identify the most critical leverage points
3. Automate the basics`,"ch02-nine-myths.md":`# Chapter 2: Shattering the 9 Financial Myths

Each myth destroys wealth. Understanding them protects your financial future.`,"ch03-three-buckets.md":`# Chapter 3: The Three-Bucket System

Security Bucket: Preserve what you have
Growth Bucket: Grow your wealth
Dream Bucket: Fund your dreams`,"ch04-all-seasons.md":`# Chapter 4: All Seasons Portfolio

Ray Dalio's strategy works across all economic environments.`,"ch05-index-funds.md":`# Chapter 5: Why Index Funds Win

The data proves: passive beats active for most investors.`,"ch07-fiduciary.md":`# Chapter 6: Broker vs. Fiduciary

Most advisors are actually brokers putting their commissions first.

## The 7 Questions

Ask these to verify you're working with a true fiduciary.`,"ch07-enjoy-share.md":`# Chapter 7: Enjoy and Share

Wealth without purpose is meaningless. Give back once you achieve financial freedom.`}},c=new class{cache=new Map;getCacheKey(e,t){return`${e}/${t}`}async loadChapter(e,t){let n=this.getCacheKey(e,t),r=this.cache.get(n);if(r)return r.content;let i=s[e];if(i&&i[t]){let e=i[t];return this.cache.set(n,{content:e,loadedAt:new Date}),e}let a=`# Content Loading Unavailable

The chapter \`${t}\` from \`${e}\` is currently loading.\n\nThis is a browser environment. In production, content will be fetched from an API endpoint.

For now, please use the built-in module content provided in each training module.`;return this.cache.set(n,{content:a,loadedAt:new Date}),a}async loadModuleChapters(e){if(e.length===0)return[];let t=e.map(async e=>({ref:e,content:await this.loadChapter(e.skill,e.chapter)}));return(await Promise.allSettled(t)).map((t,n)=>t.status===`fulfilled`?t.value:{ref:e[n],content:`Content unavailable. Please try again.`})}clearCache(){this.cache.clear()}getCacheSize(){return this.cache.size}},l=[{id:`module-1-foundation`,title:`Foundation`,subtitle:`Your Money Mindset`,description:`Establish the fundamental mindset and understanding required for financial mastery. Learn why money is important and how to take control of your financial life.`,learningObjective:`Develop a clear understanding of your relationship with money and establish the foundation for financial freedom.`,chapters:[{skill:`money-master-the-game`,chapter:`ch01-04-money-mastery.md`,title:`Money Mastery`},{skill:`unshakable`,chapter:`ch01-unshakeable.md`,title:`Unshakeable: Your Financial Freedom`},{skill:`unshakable`,chapter:`ch08-silencing-the-enemy-within.md`,title:`Silencing the Enemy Within`},{skill:`unshakable`,chapter:`ch09-real-wealth.md`,title:`Real Wealth`}],knowledgeChecks:[`What is your primary motivation for financial freedom?`,`How would you rate your current money mindset on a scale of 1-10?`,`What are the top 3 money beliefs that have shaped your financial decisions?`],assessmentLink:`/assessment/module-1-foundation`,estimatedDuration:`2 hours`},{id:`module-2-myth-busting`,title:`Myth-Busting`,subtitle:`The Financial Truth`,description:`Expose the nine financial myths that keep people trapped. Learn the truth about hidden fees, broker conflicts, and the retirement planning industry.`,learningObjective:`Identify and overcome the financial myths that have been costing you money and limiting your returns.`,chapters:[{skill:`money-master-the-game`,chapter:`ch02-00-nine-financial-myths.md`,title:`Nine Financial Myths`},{skill:`money-master-the-game`,chapter:`ch02-02-myth2-hidden-fees.md`,title:`Myth #2: Hidden Fees`},{skill:`money-master-the-game`,chapter:`ch02-04-myth4-broker-conflicts.md`,title:`Myth #4: Broker Conflicts`},{skill:`unshakable`,chapter:`ch03-hidden-fees-half-truths.md`,title:`Hidden Fees and Half Truths`},{skill:`unshakable`,chapter:`ch04-rescuing-retirement-plans.md`,title:`Rescuing Your Retirement Plans`}],knowledgeChecks:[`What is the total fee percentage you're currently paying on your investments?`,`Name 3 financial myths you previously believed`,`How do conflicts of interest in the financial industry affect your returns?`],assessmentLink:`/assessment/module-2-myth-busting`,estimatedDuration:`2 hours`},{id:`module-3-strategy`,title:`Strategy`,subtitle:`Your Game Plan`,description:`Create your personalized investment strategy. Learn the core four asset allocation, understand market cycles, and build a portfolio that can weather any season.`,learningObjective:`Design a comprehensive investment strategy based on your goals, timeline, and risk tolerance.`,chapters:[{skill:`money-master-the-game`,chapter:`ch03-01-price-of-dreams.md`,title:`The Price of Your Dreams`},{skill:`money-master-the-game`,chapter:`ch01-04-money-mastery.md`,title:`Money Mastery: The 3 Buckets`},{skill:`money-master-the-game`,chapter:`ch05-01-all-seasons.md`,title:`All Seasons Strategy`},{skill:`unshakable`,chapter:`ch02-winter-is-coming.md`,title:`Winter Is Coming: Market Cycles`},{skill:`unshakable`,chapter:`ch06-the-core-four.md`,title:`The Core Four Asset Classes`}],knowledgeChecks:[`What are the 3 buckets in your money mastery strategy?`,`How would you allocate your portfolio across the Core Four asset classes?`,`What is your target financial freedom number?`],assessmentLink:`/assessment/module-3-strategy`,estimatedDuration:`3 hours`},{id:`module-4-execution`,title:`Execution`,subtitle:`Taking Action`,description:`Put your strategy into action. Learn how to select the right investments, minimize fees and taxes, and build a diversified portfolio using index funds.`,learningObjective:`Execute your investment strategy with confidence, selecting the right vehicles and optimizing for returns.`,chapters:[{skill:`money-master-the-game`,chapter:`ch06-00-defense-first.md`,title:`Defense First: Protection Strategy`},{skill:`money-master-the-game`,chapter:`ch06-02-index-funds.md`,title:`Index Funds: The Smart Money Choice`},{skill:`unshakable`,chapter:`ch05-who-can-you-really-trust.md`,title:`Who Can You Really Trust?`}],knowledgeChecks:[`What criteria will you use to select index funds?`,`How will you minimize fees and taxes in your portfolio?`,`What is your rebalancing strategy?`],assessmentLink:`/assessment/module-4-execution`,estimatedDuration:`2 hours`},{id:`module-5-mastery`,title:`Mastery`,subtitle:`Living Wealthy`,description:`Achieve true wealth and live your purpose. Learn the Freedom Facts, master your psychology, and discover the joy of giving back.`,learningObjective:`Achieve financial mastery and live a life of abundance, purpose, and contribution.`,chapters:[{skill:`unshakable`,chapter:`ch02-winter-is-coming.md`,title:`Freedom Facts: The Truth About Markets`},{skill:`unshakable`,chapter:`ch07-slay-the-bear.md`,title:`Slay the Bear: Overcoming Fear`},{skill:`unshakable`,chapter:`ch09-real-wealth.md`,title:`Real Wealth: Living Your Purpose`},{skill:`money-master-the-game`,chapter:`ch07-00-enjoy-share.md`,title:`Enjoy and Share: The True Meaning of Wealth`}],knowledgeChecks:[`What does real wealth mean to you beyond money?`,`How will you use your wealth to make a difference?`,`What is your legacy plan?`],assessmentLink:`/assessment/module-5-mastery`,estimatedDuration:`1 hour`}];function u(e){return l.find(t=>t.id===e)}var d=i(),f=[{id:`intro`,type:`intro`,title:`Welcome to Foundation`,subtitle:`Your Money Mindset`,content:`
      <p class="text-xl mb-6">Welcome to <strong>Module 1: Foundation</strong> — the starting point of your financial mastery journey.</p>

      <p class="mb-4">In this module, you'll discover how your beliefs about money shape every financial decision you make.</p>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-teal text-xl font-bold mb-3">What You'll Learn:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>The 80/20 principle and why psychology drives results</li>
          <li>How your money story was formed</li>
          <li>How to identify and transform limiting beliefs</li>
          <li>The mindset shifts that create lasting wealth</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6">
        <h3 class="text-white text-lg font-bold mb-2">⏱️ Time Investment</h3>
        <p class="text-gray-400">Approximately 2 hours to complete this module</p>
      </div>

      <p class="text-gray-400 italic mt-6">Ready to begin building your financial foundation? Let's get started.</p>
    `,meta:{duration:`2 hours`}},{id:`80-20-principle`,type:`content`,title:`The 80/20 Principle`,subtitle:`Why Psychology Matters Most`,meta:{chapterRef:`ch01-04-money-mastery.md`,duration:`15 min`},content:`
      <p class="text-lg mb-4">The book "Money Master the Game" teaches that success in any area follows a simple rule:</p>

      <div class="bg-primary-teal/20 border-l-4 border-primary-teal p-6 my-6 rounded-r-lg">
        <p class="text-2xl font-bold text-white">80% psychology, 20% mechanics</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">What This Means:</h2>
      <ul class="list-disc list-inside space-y-2 mb-6 text-gray-300">
        <li>Your beliefs, emotions, and decisions drive 80% of your results</li>
        <li>Strategies, tactics, and tools account for only 20%</li>
        <li>You can have the best investment strategy, but if your psychology is wrong, you'll sabotage your results</li>
      </ul>

      <h2 class="text-2xl font-bold text-white mb-4">The Trap:</h2>
      <p class="text-gray-300 mb-4">Most people focus 100% on the mechanics — which stocks to buy, which app to use, which budget template to download. Meanwhile, their unconscious beliefs about money are steering them off course.</p>

      <h2 class="text-2xl font-bold text-white mb-4">The Truth:</h2>
      <p class="text-gray-300">Lasting financial transformation starts from the inside out. Change your psychology, and the right mechanics become obvious and easy to apply.</p>
    `},{id:`money-story`,type:`content`,title:`Your Money Story`,subtitle:`Understanding Your Financial Past`,meta:{chapterRef:`ch08-silencing-the-enemy-within.md`,duration:`20 min`},content:`
      <p class="text-lg mb-6">Every person has a "money story" — a collection of beliefs, memories, and emotional patterns formed primarily in childhood.</p>

      <h2 class="text-2xl font-bold text-white mb-4">How Your Story Was Written:</h2>
      <ul class="list-disc list-inside space-y-2 mb-6 text-gray-300">
        <li>What your parents said about money ("We can't afford that," "Money is the root of all evil")</li>
        <li>How your family handled financial stress (arguments, silence, avoidance)</li>
        <li>Early experiences with lack or abundance</li>
        <li>Cultural and religious messages about wealth</li>
      </ul>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h3 class="text-primary-teal text-xl font-bold mb-3">The Problem:</h3>
        <p class="text-gray-300 mb-4">Most of this story runs on autopilot in your unconscious mind. You make financial decisions based on beliefs you didn't choose and may not even know you have.</p>

        <h3 class="text-primary-teal text-xl font-bold mb-3">The Opportunity:</h3>
        <p class="text-gray-300">When you become aware of your money story, you can rewrite it. You get to choose which beliefs serve you and which need to be transformed.</p>
      </div>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-4 my-6">
        <p class="text-gray-200 italic">Reflection: What's one thing your parents said about money that you still hear in your head?</p>
      </div>
    `},{id:`quiz-80-20`,type:`quiz`,title:`Knowledge Check`,subtitle:`Test Your Understanding`,meta:{duration:`5 min`},content:`
      <p class="text-lg mb-6">Let's check your understanding of the 80/20 principle.</p>

      <h2 class="text-xl font-bold text-white mb-4">Question:</h2>
      <p class="text-xl text-gray-200 mb-8">According to the 80/20 principle in financial success, what accounts for 80% of your results?</p>
    `,options:[{value:`a`,label:`Choosing the right investments and strategies`,feedback:`Not quite. Investments and strategies are important, but they're part of the 20%. The 80% is something deeper — your psychology, beliefs, and emotional patterns drive most of your financial outcomes.`,isCorrect:!1},{value:`b`,label:`Your psychology, beliefs, and emotions`,feedback:`Exactly! Your internal world — beliefs, emotions, decisions — drives 80% of your financial results. This is why two people can use the exact same investment strategy but get completely different outcomes.`,isCorrect:!0},{value:`c`,label:`Market conditions and economic factors`,feedback:`While market conditions matter, successful investors navigate all market cycles. The 80/20 principle is about what YOU control — your psychology and decisions — not external factors.`,isCorrect:!1},{value:`d`,label:`Having a detailed budget and tracking expenses`,feedback:`Budgets are useful tools (the 20%), but they're not the primary driver. Many people budget meticulously yet still struggle because their underlying money beliefs lead to self-sabotage.`,isCorrect:!1}],correctAnswer:`b`},{id:`scenario-money-story`,type:`scenario`,title:`Identify Your Story`,subtitle:`Real-World Application`,meta:{duration:`10 min`},content:`
      <p class="text-lg mb-6">Let's apply what you've learned about money stories to a real scenario.</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-xl font-bold text-primary-teal mb-4">📖 The Scenario</h2>
        <p class="text-gray-200 mb-4">You're considering enrolling in a professional certification that could advance your career and increase your earning potential. The cost is $2,000.</p>

        <p class="text-gray-200 mb-4">Immediately, you hear an inner voice say:</p>

        <div class="bg-dark-surface border-l-4 border-primary-purple p-4 my-4 rounded-r-lg">
          <p class="text-lg text-gray-100 italic">"I'll never be wealthy because I'm not smart enough to make good investments anyway. What's the point?"</p>
        </div>

        <p class="text-gray-200">This voice is trying to talk you out of the investment.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">What is this voice telling you about your money story?</h2>
    `,options:[{value:`a`,label:`This is a fact about my abilities`,feedback:`This feels like a fact, but it's actually a belief. Abilities can be developed. Many successful investors started with zero knowledge. The voice is stating a limitation as if it's an unchangeable truth.`,isCorrect:!1},{value:`b`,label:`This is a limiting belief I learned somewhere`,feedback:`Exactly! This belief likely came from somewhere — a childhood experience, something someone said, or early failures. It's not who you are; it's a story you learned. The good news: if you learned it, you can unlearn it and replace it with a more empowering belief.`,isCorrect:!0},{value:`c`,label:`This is my intuition protecting me from risk`,feedback:`Intuition guides you toward what serves you and often feels expansive and clear. This voice sounds more like fear than intuition — it's shutting down possibility rather than helping you evaluate. True intuition would help you assess whether the certification aligns with your goals.`,isCorrect:!1}],correctAnswer:`b`},{id:`reflection`,type:`reflection`,title:`Personal Reflection`,subtitle:`Your Money Story`,meta:{duration:`15 min`},content:`
      <p class="text-lg mb-6">Now it's time to identify a limiting money belief in your own life.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Reflect on These Questions:</h2>

      <div class="space-y-4 mb-6">
        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">1. Pattern Recognition</h3>
          <p class="text-gray-300">What pattern in your financial life keeps repeating? (e.g., always broke by payday, fear of checking accounts, impulse spending when stressed)</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">2. Self-Talk</h3>
          <p class="text-gray-300">What do you say about yourself and money? (e.g., "I'm bad with money," "I'll never get ahead," "I don't understand investing")</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">3. Emotional Patterns</h3>
          <p class="text-gray-300">What emotion do you frequently feel around money? (anxiety, guilt, resentment, shame, excitement)</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">Your Reflection:</h2>
      <p class="text-gray-300 mb-4">Take a moment to identify one limiting money belief you've held. Write it below.</p>
    `},{id:`complete`,type:`content`,title:`Module Complete!`,subtitle:`Congratulations!`,content:`
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-bold text-primary-teal mb-4">Congratulations!</h2>
        <p class="text-xl text-gray-200">You've completed Module 1: Foundation</p>
      </div>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-xl font-bold text-white mb-4">Key Takeaways:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>The 80/20 principle: 80% of financial success is psychology</li>
          <li>Your money story was formed unconsciously but can be rewritten consciously</li>
          <li>Limiting beliefs feel like facts but can be transformed</li>
          <li>Awareness is the first step to changing your financial trajectory</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h3 class="text-xl font-bold text-white mb-4">What's Next:</h3>
        <p class="text-gray-300 mb-4">You've built a strong foundation. Now it's time to challenge the myths and misconceptions that keep most people trapped financially.</p>

        <p class="text-gray-300 mb-4">In <strong>Module 2: Myth-Busting</strong>, you'll discover:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-400">
          <li>The nine financial myths that destroy wealth</li>
          <li>Hidden fees that are secretly eating your returns</li>
          <li>Conflicts of interest in the financial industry</li>
          <li>How to spot and avoid financial half-truths</li>
        </ul>
      </div>

      <div class="text-center mt-8">
        <p class="text-gray-400 italic">Your progress has been saved. Continue your journey to financial mastery!</p>
      </div>
    `}];function p(){let e=r(),{startModule:t,recordScreenProgress:i,completeModule:s,getModuleProgress:l,setCurrentScreen:p}=n(),[h,g]=(0,o.useState)(0),[_,v]=(0,o.useState)(null),[y,b]=(0,o.useState)(!1),[x,S]=(0,o.useState)(``),[C,w]=(0,o.useState)({}),T=u(`module-1-foundation`),E=f[h],D=h===f.length-1,O=(h+1)/f.length*100;(0,o.useEffect)(()=>{t(`module-1-foundation`);let e=l(`module-1-foundation`);if(e&&e.currentScreen){let t=f.findIndex(t=>t.id===e.currentScreen);t>=0&&g(t)}},[]),(0,o.useEffect)(()=>{async function e(){let e={};for(let t of f)if(t.meta?.chapterRef&&T){let n=T.chapters.find(e=>e.chapter===t.meta?.chapterRef);if(n)try{let r=await c.loadChapter(n.skill,n.chapter);e[t.id]=r}catch(e){console.warn(`Failed to load content for ${t.id}:`,e)}}w(e)}e()},[]),(0,o.useEffect)(()=>{E&&(i(`module-1-foundation`,E.id,f.length),p(E.id))},[h]);let k=e=>{v(e),b(!0)},A=()=>{setTimeout(()=>j(),500)},j=()=>{D?(s(`module-1-foundation`),e(`/training`)):(g(h+1),v(null),b(!1),S(``))},M=()=>{h>0?(g(h-1),v(null),b(!1)):e(`/training`)};return(0,d.jsx)(`div`,{className:`min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4`,children:(0,d.jsxs)(`div`,{className:`max-w-4xl mx-auto`,children:[(0,d.jsxs)(`div`,{className:`mb-6`,children:[(0,d.jsxs)(`div`,{className:`flex justify-between text-sm text-gray-400 mb-2`,children:[(0,d.jsxs)(`span`,{children:[`Screen `,h+1,` of `,f.length]}),(0,d.jsxs)(`span`,{children:[Math.round(O),`%`]})]}),(0,d.jsx)(`div`,{className:`w-full bg-dark-bg rounded-full h-2`,children:(0,d.jsx)(`div`,{className:`bg-primary-teal h-2 rounded-full transition-all duration-300`,style:{width:`${O}%`}})})]}),(0,d.jsxs)(`div`,{className:`bg-dark-surface border border-dark-border rounded-lg p-8`,children:[E.title&&(0,d.jsx)(`h1`,{className:`text-4xl font-bold text-white mb-2`,children:E.title}),E.subtitle&&(0,d.jsx)(`p`,{className:`text-xl text-primary-teal mb-6`,children:E.subtitle}),(0,d.jsx)(`div`,{className:`prose prose-invert max-w-none`,children:E.type===`reflection`?(0,d.jsx)(m,{screen:E,response:x,onResponseChange:S,onSubmit:A,onBack:M}):(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(`div`,{className:`text-gray-300 leading-relaxed`,dangerouslySetInnerHTML:a(C[E.id]?C[E.id]:E.content||``)}),(E.type===`quiz`||E.type===`scenario`)&&E.options&&(0,d.jsx)(`div`,{className:`mt-8 space-y-3`,children:E.options.map(e=>(0,d.jsx)(`button`,{onClick:()=>k(e.value),disabled:y,className:`w-full text-left px-6 py-4 rounded-lg border transition-all ${_===e.value?y&&e.isCorrect?`bg-green-400/20 border-green-400`:y?`bg-red-400/20 border-red-400`:`bg-primary-teal/20 border-primary-teal`:`bg-dark-bg border-dark-border hover:border-primary-teal`} ${y?`cursor-default`:`hover:bg-primary-teal/10`}`,children:(0,d.jsx)(`span`,{className:`text-gray-200 font-semibold`,children:e.label})},e.value))}),y&&_&&E.options&&(0,d.jsx)(`div`,{className:`mt-6 p-4 rounded-lg border ${_===E.correctAnswer?`bg-green-400/10 border-green-400/30`:`bg-red-400/10 border-red-400/30`}`,children:(0,d.jsx)(`p`,{className:`text-gray-300`,children:E.options.find(e=>e.value===_)?.feedback||``})}),(E.type===`intro`||E.type===`content`||E.type===`quiz`||E.type===`scenario`)&&(0,d.jsxs)(`div`,{className:`flex justify-between items-center mt-8`,children:[(0,d.jsx)(`button`,{onClick:M,className:`px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold`,children:`← Back`}),(0,d.jsx)(`button`,{onClick:j,disabled:(E.type===`quiz`||E.type===`scenario`)&&!y,className:`px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`,children:D?`Complete Module →`:`Continue →`})]})]})})]})]})})}function m({screen:e,response:t,onResponseChange:n,onSubmit:r,onBack:i}){return(0,d.jsxs)(`div`,{children:[(0,d.jsx)(`div`,{className:`text-gray-300 leading-relaxed mb-6`,dangerouslySetInnerHTML:a(e.content||``)}),(0,d.jsx)(`textarea`,{value:t,onChange:e=>n(e.target.value),placeholder:`Type your reflection here...`,className:`w-full h-40 bg-dark-bg border border-dark-border rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-primary-teal focus:outline-none resize-none`}),(0,d.jsxs)(`div`,{className:`flex justify-between items-center mt-6`,children:[(0,d.jsx)(`button`,{onClick:i,className:`px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold`,children:`← Back`}),(0,d.jsx)(`button`,{onClick:r,disabled:!t.trim(),className:`px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed`,children:`Save & Continue →`})]})]})}export{p as default};
//# sourceMappingURL=Module1-fm5ZUtZX.js.map