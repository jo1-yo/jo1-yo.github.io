document.getElementById('fetchData').addEventListener('click', function() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('dataContainer').innerText = JSON.stringify(data);
        })
        .catch(error => console.error('Error:', error));
})