document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const modal = document.getElementById('homework-modal');
    const closeButton = document.querySelector('.close-button');
    const homeworkItems = document.querySelectorAll('.homework-item');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Add event listeners for action buttons
    const uploadButton = document.getElementById('upload-btn');
    const fileUpload = document.getElementById('file-upload');

    uploadButton.addEventListener('click', () => {
        fileUpload.click();
    });

    fileUpload.addEventListener('change', () => {
        const file = fileUpload.files[0];
        if (file) {
            console.log(`File uploaded: ${file.name}`);
            // Here you would typically handle the file upload to a server
        }
    });

    const commentButton = document.getElementById('comment-btn');
    commentButton.addEventListener('click', () => {
        console.log('Comment button clicked');
    });

    const subjectButton = document.getElementById('subject-btn');
    subjectButton.addEventListener('click', () => {
        console.log('Subject button clicked');
    });

    homeworkItems.forEach(item => {
        item.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});