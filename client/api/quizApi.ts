fetch('/level1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify([
    new Number(3)
  ])
});