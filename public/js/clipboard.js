window.Clipboard = {
  items: [],

  init: function() {
    var self = this;
    this.items = JSON.parse(localStorage.getItem('tutor_clipboard') || '[]');
    var btn = document.getElementById('clip-btn');
    var popup = document.getElementById('clip-popup');

    btn.addEventListener('click', function() {
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
      self.render();
    });

    document.getElementById('clip-close').addEventListener('click', function() {
      popup.style.display = 'none';
    });

    document.getElementById('clip-save').addEventListener('click', function() {
      self.save();
    });

    document.getElementById('clip-clear').addEventListener('click', function() {
      self.items = [];
      self.persist();
      self.render();
    });

    // Allow Enter key to save
    document.getElementById('clip-value').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') self.save();
    });
    document.getElementById('clip-label').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') self.save();
    });
  },

  save: function() {
    var label = document.getElementById('clip-label').value.trim();
    var value = document.getElementById('clip-value').value.trim();
    if (!label || !value) return;
    this.items.push({ label: label, value: value, id: Date.now() });
    this.persist();
    this.render();
    document.getElementById('clip-label').value = '';
    document.getElementById('clip-value').value = '';
    document.getElementById('clip-label').focus();
  },

  remove: function(id) {
    this.items = this.items.filter(function(i) { return i.id !== id; });
    this.persist();
    this.render();
  },

  persist: function() {
    localStorage.setItem('tutor_clipboard', JSON.stringify(this.items));
  },

  render: function() {
    var self = this;
    var list = document.getElementById('clip-list');
    if (this.items.length === 0) {
      list.innerHTML = '<p style="color:#666;font-size:13px;margin:0;">No saved values yet.</p>';
      return;
    }
    list.innerHTML = this.items.map(function(item) {
      return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #eee;">' +
        '<span style="flex:1;font-size:13px;word-break:break-word;"><strong>' + item.label + ':</strong> ' + item.value + '</span>' +
        '<button onclick="Clipboard.remove(' + item.id + ')" style="background:none;border:none;color:#dc2626;cursor:pointer;font-size:18px;line-height:1;flex-shrink:0;">×</button>' +
        '</div>';
    }).join('');
  }
};
