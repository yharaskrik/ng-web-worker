addEventListener('message', (ev) => {
  if (ev.data === 'portTransfer') {
    const port = ev.ports[0];

    port.onmessage = (ev) =>
      console.log('Received on secondary from ', ev.data.worker);
  }
});
