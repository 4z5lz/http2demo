const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
const isH2 = location.search.includes('http2');

document.getElementById('title').innerHTML = isH2 ? 'Load 272 images via HTTP/2' : 'Load 272 images via HTTP/1.1';
document.getElementById('switchBtn').innerHTML = isH2 ? 'Switch to HTTP/1.1' : 'Switch to HTTP/2';

if (connection) {
  let speedType = 'fast';
  if (/\slow-2g|2g|3g/.test(connection.effectiveType)) {
    speedType = 'slow';
  }

  document.getElementById('network').innerHTML = `<strong>Network speed type:</strong> ${speedType}<br>
    <strong>Network type:</strong> ${connection.effectiveType}`;
}

const performanceData = [];
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver(list => {
    const entries = list.getEntries();
    entries.map(res => {
      if (res.initiatorType === 'img') {
        performanceData.push({
          name: res.name,
          startTime: res.startTime,
          responseEnd: res.responseEnd,
          duration: res.duration,
          rawData: res
        });
      }
    });
  });
  observer.observe({ entryTypes: ['resource'] });
}

window.addEventListener('load', () => {
  // Calculate avg. load duration
  let avgLoadDuration = (performanceData.reduce((r, c) => r + c.duration, 0) / performanceData.length / 1000).toFixed(
    3
  );

  // Calculate total images loading time
  let responseEnd = (performanceData.reduce((r, c) => Math.max(r, c.responseEnd), 0) / 1000).toFixed(3);

  document.getElementById('switchBtn').style.display = 'block';
  document.getElementById('performance').innerHTML = `<strong>Avg. load duration:</strong> ${avgLoadDuration} sec<br>
    <strong>All images loaded within:</strong> <strong style='color:red'>${responseEnd} sec.</strong>`;
});

$(document).ready(function() {
  const url =
    (isH2 ? 'https' : 'http') +
    '://viewer-akamai-us-4.qa.sarine.com/qa4/alexs/imgoptim_demo/400x400_jpeg_75/img{num}.jpg?rand=' +
    Math.random();

  $('#imageplayer')
    .empty()
    .imgplay({
      totalImages: 272,
      imageName: 'img{num}.jpg',
      urlDir: url,
      rate: 30,
      height: 320,
      width: 320,
      autoPlay: true
    });
});

const switchPage = () => (location.href = location.href.replace('?http2', '') + (isH2 ? '' : '?http2'));
