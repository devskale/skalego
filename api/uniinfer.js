export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send('uniinfer @ git+https://github.com/devskale/python-openutils.git#subdirectory=packages/uniinfer\n');
}
