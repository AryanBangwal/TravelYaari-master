document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form's default behavior

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); // This line could fail if server response is empty
        console.log(data);
        alert(data.message);
    } catch (error) {
        console.error('Failed to submit signup:', error);
        alert('Something went wrong. Please try again.');
    }
});
