document.getElementById('fetchData').addEventListener('click', function() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('dataContainer').innerText = JSON.stringify(data);
        })
        .catch(error => console.error('Error:', error));
})
const projectsSection = document.querySelector('#projects');
const logo = document.querySelector('.logo');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        logo.style.display = 'none'; // 隐藏 logo
      } else {
        logo.style.display = 'block'; // 显示 logo
      }
    });
  },
  {
    threshold: 0.1, // 10% 出现在视口就触发
  }
);

if (projectsSection) {
  observer.observe(projectsSection);
}
