window.Calculator = {
  memory: 0,
  expression: '',

  init: function() {
    var self = this;
    var btn = document.getElementById('calc-btn');
    var popup = document.getElementById('calc-popup');

    btn.addEventListener('click', function() {
      popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('calc-close').addEventListener('click', function() {
      popup.style.display = 'none';
    });

    document.querySelectorAll('.calc-key').forEach(function(k) {
      k.addEventListener('click', function() {
        self.press(k.dataset.val);
      });
    });

    // Make calculator draggable
    var isDragging = false;
    var dragOffsetX = 0, dragOffsetY = 0;
    var header = popup.querySelector('.calc-header');
    if (header) {
      header.style.cursor = 'move';
      header.addEventListener('mousedown', function(e) {
        isDragging = true;
        var rect = popup.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        e.preventDefault();
      });
      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        popup.style.right = 'auto';
        popup.style.bottom = 'auto';
        popup.style.left = (e.clientX - dragOffsetX) + 'px';
        popup.style.top = (e.clientY - dragOffsetY) + 'px';
      });
      document.addEventListener('mouseup', function() { isDragging = false; });
    }
  },

  press: function(val) {
    var display = document.getElementById('calc-display');
    if (val === 'C') {
      this.expression = '';
      display.value = '0';
      return;
    }
    if (val === '=') {
      try {
        var result = Function('"use strict"; return (' + this.expression + ')')();
        var rounded = Math.round(result * 10000) / 10000;
        display.value = rounded;
        this.expression = String(rounded);
      } catch(e) {
        display.value = 'Error';
        this.expression = '';
      }
      return;
    }
    if (val === 'MS') {
      this.memory = parseFloat(display.value) || 0;
      var msBtn = document.querySelector('[data-val="MS"]');
      if (msBtn) { msBtn.style.background = '#bfdbfe'; setTimeout(function() { msBtn.style.background = '#f0f4ff'; }, 300); }
      return;
    }
    if (val === 'MR') {
      this.expression += String(this.memory);
      display.value = this.expression;
      return;
    }
    if (val === '⌫') {
      this.expression = this.expression.slice(0, -1);
      display.value = this.expression || '0';
      return;
    }
    this.expression += val;
    display.value = this.expression;
  }
};
