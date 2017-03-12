require('./src/engine/ioc.js');

const hello = () => {
  console.debug('YOLO');
  document.body.innerHTML = '<b>lalal</b>';
  return 2/1;
};

hello();