// public/script.js

// Function to toggle between Login and Signup forms
function toggleForm(formType) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const messageDisplay = document.getElementById('message-display');
    messageDisplay.textContent = ''; // Clear messages

    if (formType === 'signup') {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    } else {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    }
}

// Function to display messages
function displayMessage(message, isSuccess = true) {
    const messageDisplay = document.getElementById('message-display');
    messageDisplay.textContent = message;
    messageDisplay.style.color = isSuccess ? 'green' : 'red';
}

// --- Signup Handler ---
document.getElementById('signup-client-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            displayMessage(data.message + ' You can now log in.', true);
            // Optionally switch to login form after successful signup
            setTimeout(() => toggleForm('login'), 2000); 
        } else {
            displayMessage('Signup Failed: ' + data.message, false);
        }
    } catch (error) {
        console.error('Error during signup:', error);
        displayMessage('An unexpected error occurred during signup.', false);
    }
});


// --- Login Handler ---
document.getElementById('login-client-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (data.success) {
            // Success: In a real app, this would redirect or set a session/token
            displayMessage(`Welcome back, ${data.username}! Login successful.`, true);
            // Example: Redirect to a client dashboard page
            // window.location.href = '/dashboard.html';
        } else {
            displayMessage('Login Failed: ' + data.message, false);
        }
    } catch (error) {
        console.error('Error during login:', error);
        displayMessage('An unexpected error occurred during login.', false);
    }
});

// public/script.js (ADD THIS NEW SECTION)

// --- Universal Order Form Handler Function ---
async function handleOrderSubmission(event) {
    event.preventDefault(); // Stop the default browser submission
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Convert form data to a simple JSON object
    const orderData = {};
    formData.forEach((value, key) => {
        orderData[key] = value;
    });

    const messageDisplay = document.getElementById('message-display');

    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (data.success) {
            displayMessage(data.message, true);
            form.reset(); // Clear the form on success
        } else {
            displayMessage('Submission Failed: ' + data.message, false);
        }
    } catch (error) {
        console.error('Error submitting order:', error);
        displayMessage('An unexpected error occurred. Please check your network connection.', false);
    }
}


// --- Attaching the Handler to All Forms ---
document.addEventListener('DOMContentLoaded', () => {
    // Attach the handler to the Executive Protection form
    const executiveForm = document.getElementById('order-form-executive');
    if (executiveForm) {
        executiveForm.addEventListener('submit', handleOrderSubmission);
    }

    // Attach the handler to the Consulting form
    const consultingForm = document.getElementById('order-form-consulting');
    if (consultingForm) {
        consultingForm.addEventListener('submit', handleOrderSubmission);
    }
    
    // Attach the handler to the Event Security form
    const eventForm = document.getElementById('order-form-event');
    if (eventForm) {
        eventForm.addEventListener('submit', handleOrderSubmission);
    }
    
    // (Keep the existing login/signup handlers below this section)
});