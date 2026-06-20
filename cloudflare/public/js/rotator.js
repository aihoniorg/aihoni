/* aihoni — rotating multilingual text.
   Cycles configured elements through phrases in many languages with a
   fade/lift swap. Honours prefers-reduced-motion (stays on the first item). */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var sets = {
    // hero greeting word
    greet: {
      every: 2200,
      words: [
        'नमस्ते!', 'Hello!', 'नमस्कार!', 'ཀུ་ཟུ་ཟང་པོ།', 'হ্যালো!', 'নমস্কার!',
        'مرحبا!', 'السلام عليكم', 'Hola!', 'Bonjour!', 'Hallo!', 'Ciao!', 'Olá!',
        '你好!', 'こんにちは!', '안녕하세요!', 'Привет!', 'السلام علیکم', 'வணக்கம்!',
        'నమస్తే!', 'નમસ્તે!', 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ!', 'Merhaba!', 'สวัสดี!', 'Halo!',
        'Xin chào!', 'Kamusta!', 'Jambo!'
      ]
    },
    // closing CTA question: "Ready to stay close?"
    ctaline: {
      every: 2600,
      words: [
        'आफ्नालाई नजिक राख्न तयार?',
        'Ready to stay close?',
        'अपनों को करीब रखने को तैयार?',
        '¿Listo para estar cerca?',
        'Prêt à rester proche ?',
        'Pronto para ficar perto?',
        'Bereit, nah zu bleiben?',
        'Pronto a restare vicino?',
        'هل أنت مستعد للبقاء قريبًا؟',
        '准备好保持联系了吗？',
        '가까이 지낼 준비 됐나요?',
        'Hazır mısın yakın kalmaya?'
      ]
    }
  };

  Object.keys(sets).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    var cfg = sets[id], i = 0;
    setInterval(function () {
      el.classList.add('swap');
      setTimeout(function () {
        i = (i + 1) % cfg.words.length;
        el.textContent = cfg.words[i];
        el.classList.remove('swap');
      }, 320);
    }, cfg.every);
  });
})();
