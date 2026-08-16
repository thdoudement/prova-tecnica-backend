const queue = [];
let processing = false;

function processNext() {
  if (processing || queue.length === 0) return;

  processing = true;
  const job = queue.shift();

  setTimeout(() => {
    console.log(`[queue] Notificação processada para notícia #${job.noticiaId}: "${job.titulo}"`);
    processing = false;
    processNext();
  }, 100);
}

export function enqueueNotificacao({ noticiaId, titulo }) {
  queue.push({ noticiaId, titulo, enqueuedAt: new Date().toISOString() });
  processNext();
}

export function getQueueSize() {
  return queue.length;
}
