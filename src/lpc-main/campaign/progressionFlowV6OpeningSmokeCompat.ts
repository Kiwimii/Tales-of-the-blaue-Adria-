const query = new URLSearchParams(location.search);
if (query.get('opening') === '1') {
  const timer = window.setInterval(() => {
    const bridge = (window as unknown as Record<string, any>).__lpcOpeningV5;
    if (!bridge?.setArrivalPhase || bridge.__progressionV6Wrapped) return;
    bridge.__progressionV6Wrapped = true;
    const original = bridge.setArrivalPhase.bind(bridge) as (phase: string) => void;
    bridge.setArrivalPhase = (phase: string): void => {
      original(phase);
      if (phase !== 'ready') return;
      const lockUntil = performance.now() + 4500;
      const lock = window.setInterval(() => {
        if (performance.now() >= lockUntil || !document.getElementById('opening-v5-arrival')) {
          window.clearInterval(lock);
          return;
        }
        original('ready');
      }, 40);
    };
    window.clearInterval(timer);
  }, 25);
}
