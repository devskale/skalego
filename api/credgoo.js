export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send('credgoo @ git+https://github.com/devskale/python-openutils.git#subdirectory=packages/credgoo\n');
}
