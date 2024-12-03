import { generateHTMLFromInput } from './script.js';

export function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleHelp() {
    const modal = document.getElementById('help-modal');
    modal.classList.toggle('show');
}

function handleTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });
}

// UI Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const generateBtn = document.getElementById('generate');
    const copyBtn = document.getElementById('copy');
    const downloadBtn = document.getElementById('download');
    const themeToggle = document.getElementById('theme-toggle');
    const helpBtn = document.getElementById('help-btn');
    const closeHelp = document.getElementById('close-help');
    
    let generatedHTML = '';

    initTheme();
    handleTabs();

    generateBtn.addEventListener('click', () => {
        const inputScript = editor.value;
        try {
            generatedHTML = generateHTMLFromInput(inputScript);
            showNotification('HTML generated successfully! Click "Copy" to copy to clipboard.');
        } catch (error) {
            showNotification('Error generating HTML: ' + error.message, 5000);
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (!generatedHTML) {
            showNotification('Please generate HTML first!');
            return;
        }
        
        try {
            // Create a Blob containing the HTML
            const blob = new Blob([generatedHTML], { type: 'text/html' });
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            // Set the download filename
            const date = new Date();
            const timestamp = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}`;
            link.download = `generated_${timestamp}.html`;
            
            // Append link to body, click it, and remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the URL object
            URL.revokeObjectURL(link.href);
            
            showNotification('HTML file downloaded successfully!');
        } catch (err) {
            showNotification('Failed to download HTML file');
        }
    });

    copyBtn.addEventListener('click', async () => {
        if (!generatedHTML) {
            showNotification('Please generate HTML first!');
            return;
        }

        try {
            await navigator.clipboard.writeText(generatedHTML);
            showNotification('HTML copied to clipboard!');
        } catch (err) {
            showNotification('Failed to copy to clipboard');
        }
    });

    themeToggle.addEventListener('click', toggleTheme);
    helpBtn.addEventListener('click', toggleHelp);
    closeHelp.addEventListener('click', toggleHelp);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('help-modal');
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}); 