(() => {
  const key = 'avery-six-months-records-v1';
  const milk = [
    ['🌱', '先换一餐', '一天一次，慢慢把这一餐换成 2 段奶粉。Avery 适应后，再按医生安排继续。'],
    ['👀', '留意适应情况', '留意食量、便便、皮肤和精神状态；有疑问就问儿科医生，不需要急着全部换掉。'],
    ['🫶', '冲调按照奶粉罐', '奶粉和水的比例按照奶粉罐说明。米粉用奶调好后，用勺喂，不要倒进奶瓶。'],
  ];
  const mixes = [
    ['150 ml', '1–2 勺', '用一顿精神比较好时的奶，冲好奶后调成稀稀的米糊。先试一两勺，不需要一次吃完。'],
    ['90 ml', '慢慢增加', 'Avery 适应后，逐步把米糊做成约 90 ml 奶冲出来的分量，继续用勺喂。'],
    ['120 ml', '一顿奶', '再慢慢到约 120 ml 奶冲出来的米糊，作为一顿奶的替代；节奏跟着 Avery 的反应走。'],
  ];
  const parentPhones = ['+8615817468347', '+8618588284390'];
  let done = [false, false, false];
  let water = 0;
  let records = readRecords();

  function readRecords() { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } }
  function persist() { localStorage.setItem(key, JSON.stringify(records)); }
  function todayRecord() { return { completedTasks: done.slice(), waterMl: water, createdAt: new Date().toISOString() }; }
  function updateProgress() { const count = done.filter(Boolean).length; document.querySelector('#done-count').textContent = count; document.querySelector('#done-count-big').textContent = count; document.querySelectorAll('[data-task]').forEach((card, i) => { card.classList.toggle('is-done', done[i]); card.querySelector('.task-check').textContent = done[i] ? '✓' : String(i + 1); card.querySelector('.task-action').textContent = done[i] ? '完成啦' : '轻触打勾'; }); }
  function updateWater() { document.querySelector('#water-number').textContent = water; document.querySelector('#water-fill').style.height = `${Math.min(water / 2, 100)}%`; }
  function renderHistory() { const list = document.querySelector('#history-list'); document.querySelector('#history-count').textContent = records.length; if (!records.length) { list.innerHTML = '<p class="empty-history">保存今天的记录后，这里会自动留下每天的小足迹。记录保存在这台手机的浏览器里。</p>'; return; } list.innerHTML = `<div class="history-list">${records.slice(0, 7).map((item) => { const date = new Date(item.createdAt); const count = item.completedTasks.filter(Boolean).length; return `<div class="history-row"><div class="history-date"><strong>${date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}</strong><small>${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</small></div><div class="history-bar"><span style="width:${Math.max(18, count / 3 * 100)}%"></span><small>${count}/3 项完成</small></div><div class="history-water">💧 ${item.waterMl} ml</div><a href="#history">查看 ↗</a></div>`; }).join('')}</div>`; }
  function saveRecord() { records.unshift(todayRecord()); records = records.slice(0, 30); persist(); renderHistory(); const report = `Avery 今日记录：已完成 ${done.filter(Boolean).length}/3 项，记录饮水 ${water} ml。`; const url = `${location.origin}${location.pathname}?report=${encodeURIComponent(JSON.stringify(todayRecord()))}`; document.querySelector('#record-result').innerHTML = `今天已保存 ✓<br><span>记录链接：${url}</span>`; const sms = document.querySelector('#sms-button'); sms.hidden = false; sms.dataset.report = `${report} 查看记录：${url}`; }
  document.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })));
  document.querySelectorAll('[data-task]').forEach((card) => card.addEventListener('click', () => { const i = Number(card.dataset.task); done[i] = !done[i]; updateProgress(); }));
  document.querySelectorAll('[data-milk]').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('[data-milk]').forEach((b) => b.classList.toggle('active', b === button)); const item = milk[Number(button.dataset.milk)]; document.querySelector('#milk-sticker').textContent = item[0]; document.querySelector('#milk-title').textContent = item[1]; document.querySelector('#milk-copy').textContent = item[2]; }));
  document.querySelectorAll('[data-mix]').forEach((button) => button.addEventListener('click', () => { const i = Number(button.dataset.mix); document.querySelectorAll('[data-mix]').forEach((b) => b.classList.toggle('active', b === button)); document.querySelector('.rice-bowl').className = `rice-bowl rice-level-${i}`; document.querySelector('#mix-amount').textContent = mixes[i][0]; document.querySelector('#mix-spoon').textContent = mixes[i][1]; document.querySelector('#mix-copy').textContent = mixes[i][2]; }));
  document.querySelector('#water-minus').addEventListener('click', () => { water = Math.max(0, water - 20); updateWater(); });
  document.querySelector('#water-plus').addEventListener('click', () => { water = Math.min(200, water + 20); updateWater(); });
  document.querySelector('#water-clear').addEventListener('click', () => { water = 0; updateWater(); });
  document.querySelector('#save-record').addEventListener('click', saveRecord);
  document.querySelector('#sms-button').addEventListener('click', (event) => { const body = encodeURIComponent(event.currentTarget.dataset.report || 'Avery 今日记录'); const isApple = /iPhone|iPad|iPod/i.test(navigator.userAgent); location.href = isApple ? `sms://open?addresses=${parentPhones.join(',')}&body=${body}` : `sms:${parentPhones.join(',')}?body=${body}`; });
  const shared = new URLSearchParams(location.search).get('report'); if (shared) { try { const item = JSON.parse(shared); const note = document.querySelector('#shared-note'); note.textContent = `这是 Avery 分享来的记录：${item.completedTasks.filter(Boolean).length}/3 项完成，饮水 ${item.waterMl} ml。`; note.classList.add('show'); } catch {} }
  updateProgress(); updateWater(); renderHistory();
})();
