window.Progress = {
  get KEY() { return window.AUTH ? window.AUTH.progressKey() : 'accounting_tutor_progress'; },

  TOTALS: { ch1:15, ch2:15, ch5:15, ch6:15, ch7:15, ch8:15, ch9:15, ch10:15, ch11:15, ch12:15 },

  normalize: function(data) {
    var self = this;
    Object.keys(self.TOTALS).forEach(function(ch) {
      if (data.chapters[ch]) data.chapters[ch].total = self.TOTALS[ch];
    });
    return data;
  },

  load: function() {
    try {
      var data = JSON.parse(localStorage.getItem(this.KEY)) || this.default();
      return this.normalize(data);
    } catch(e) { return this.default(); }
  },

  save: function(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  default: function() {
    return {
      chapters: {
        ch1:  { completed: 0, total: 15, attempts: {} },
        ch2:  { completed: 0, total: 15, attempts: {} },
        ch5:  { completed: 0, total: 15, attempts: {} },
        ch6:  { completed: 0, total: 15, attempts: {} },
        ch7:  { completed: 0, total: 15, attempts: {} },
        ch8:  { completed: 0, total: 15, attempts: {} },
        ch9:  { completed: 0, total: 15, attempts: {} },
        ch10: { completed: 0, total: 15, attempts: {} },
        ch11: { completed: 0, total: 15, attempts: {} },
        ch12: { completed: 0, total: 15, attempts: {} }
      },
      testHistory: []
    };
  },

  markCorrect: function(chapter, questionIdx) {
    var data = this.load();
    if (!data.chapters[chapter]) return;
    var key = 'q' + questionIdx;
    if (!data.chapters[chapter].attempts[key]) {
      data.chapters[chapter].attempts[key] = { correct: false, tries: 0 };
    }
    data.chapters[chapter].attempts[key].correct = true;
    data.chapters[chapter].attempts[key].tries++;
    data.chapters[chapter].completed = Object.values(data.chapters[chapter].attempts).filter(function(a) { return a.correct; }).length;
    this.save(data);
  },

  markAttempt: function(chapter, questionIdx) {
    var data = this.load();
    if (!data.chapters[chapter]) return;
    var key = 'q' + questionIdx;
    if (!data.chapters[chapter].attempts[key]) {
      data.chapters[chapter].attempts[key] = { correct: false, tries: 0 };
    }
    data.chapters[chapter].attempts[key].tries++;
    this.save(data);
  },

  getOverallPct: function() {
    var data = this.load();
    var total = 0, done = 0;
    Object.values(data.chapters).forEach(function(c) { total += c.total; done += c.completed; });
    return total === 0 ? 0 : Math.round((done / total) * 100);
  },

  getChapterPct: function(chapter) {
    var data = this.load();
    var c = data.chapters[chapter];
    if (!c) return 0;
    return c.total === 0 ? 0 : Math.round((c.completed / c.total) * 100);
  },

  getChapterData: function(chapter) {
    var data = this.load();
    return data.chapters[chapter] || { completed: 0, total: 0, attempts: {} };
  },

  addTestResult: function(result) {
    var data = this.load();
    data.testHistory.push(Object.assign({}, result, { date: new Date().toISOString() }));
    if (data.testHistory.length > 20) data.testHistory = data.testHistory.slice(-20);
    this.save(data);
  },

  reset: function() {
    this.save(this.default());
  }
};
