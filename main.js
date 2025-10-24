document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const modal = document.getElementById('homework-modal');
    const closeButton = document.querySelector('.close-button');
    const homeworkList = document.querySelector('.homework-list');
    let activeHomeworkId = null;

    // --- Data ---
    const homeworkData = [
        {
            id: 'hw1',
            title: 'Maths Assignment',
            description: 'Chapter 5, exercises 1-10',
            dueDate: 'Oct 26',
            completed: false,
            comments: ['This looks tough!', 'I need help with question 5.'],
            reactions: ['👍', '😮'],
        },
        {
            id: 'hw2',
            title: 'History Essay',
            description: 'The French Revolution',
            dueDate: 'Oct 28',
            completed: true,
            comments: [],
            reactions: ['💯'],
        },
        {
            id: 'hw3',
            title: 'Science Project',
            description: 'Build a model of a volcano.',
            dueDate: 'Nov 02',
            completed: false,
            comments: [],
            reactions: [],
        },
    ];

    // --- Render Function ---
    const renderHomework = () => {
        homeworkList.innerHTML = ''; // Clear existing items
        homeworkData.forEach(item => {
            const homeworkItem = document.createElement('div');
            homeworkItem.className = `homework-item ${item.completed ? 'completed' : ''}`;
            homeworkItem.dataset.id = item.id;

            homeworkItem.innerHTML = `
                <div class="homework-status">
                    <span class="due-date">${item.dueDate}</span>
                    <input type="checkbox" id="${item.id}" name="${item.id}" ${item.completed ? 'checked' : ''}>
                    <label for="${item.id}"></label>
                </div>
                <div class="homework-details">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            homeworkList.appendChild(homeworkItem);
        });
    };

    // --- Event Delegation for Homework List ---
    homeworkList.addEventListener('click', (e) => {
        const homeworkItem = e.target.closest('.homework-item');
        if (!homeworkItem) return;

        const clickedItemId = homeworkItem.dataset.id;
        const homework = homeworkData.find(item => item.id === clickedItemId);

        // Checkbox click
        if (e.target.matches('input[type="checkbox"]') || e.target.matches('label')) {
            const checkbox = homeworkItem.querySelector('input[type="checkbox"]');
             // Let the 'change' event handle the logic
            if(e.target.matches('label')) {
                checkbox.checked = !checkbox.checked;
            }
            homework.completed = checkbox.checked;
            homeworkItem.classList.toggle('completed', checkbox.checked);
            return; // Stop further execution
        }

        // Open modal for other clicks
        activeHomeworkId = clickedItemId;
        document.getElementById('modal-title').textContent = homework.title;
        document.getElementById('modal-description').textContent = homework.description;

        // Render comments
        renderComments(homework.comments);

        // Render reactions
        renderReactions(homework.reactions);

        modal.style.display = 'block';
    });


    // --- Other Event Listeners ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    const uploadButton = document.getElementById('upload-btn');
    const fileUpload = document.getElementById('file-upload');
    uploadButton.addEventListener('click', () => fileUpload.click());
    fileUpload.addEventListener('change', () => {
        if (fileUpload.files.length > 0) {
            console.log(`File uploaded: ${fileUpload.files[0].name}`);
        }
    });

    document.getElementById('comment-btn').addEventListener('click', () => console.log('Comment button clicked'));
    document.getElementById('subject-btn').addEventListener('click', () => console.log('Subject button clicked'));

    const renderComments = (comments) => {
        const commentsContainer = document.getElementById('comments-container');
        commentsContainer.innerHTML = '';
        comments.forEach(commentText => {
            const comment = document.createElement('div');
            comment.className = 'comment';
            comment.textContent = commentText;
            commentsContainer.appendChild(comment);
        });
    };

    document.getElementById('post-comment-btn').addEventListener('click', () => {
        const commentInput = document.getElementById('comment-input');
        const newComment = commentInput.value.trim();
        if (newComment && activeHomeworkId) {
            const homework = homeworkData.find(item => item.id === activeHomeworkId);
            homework.comments.push(newComment);
            renderComments(homework.comments);
            commentInput.value = '';
        }
    });

    const renderReactions = (reactions) => {
        const reactionsContainer = document.getElementById('reactions-container');
        reactionsContainer.innerHTML = '';
        reactions.forEach(reactionText => {
            const reaction = document.createElement('div');
            reaction.className = 'reaction';
            reaction.textContent = reactionText;
            reactionsContainer.appendChild(reaction);
        });
    };

    document.querySelectorAll('.emoji-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (activeHomeworkId) {
                const homework = homeworkData.find(item => item.id === activeHomeworkId);
                homework.reactions.push(button.textContent);
                renderReactions(homework.reactions);
            }
        });
    });

    closeButton.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    const magneticButtons = document.querySelectorAll('.action-btn');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const { offsetX, offsetY, target } = e;
            const { clientWidth, clientHeight } = target;
            const x = (offsetX / clientWidth) * 2 - 1;
            const y = (offsetY / clientHeight) * 2 - 1;
            target.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
        });
        button.addEventListener('mouseleave', (e) => e.target.style.transform = '');
    });

    // --- Initial Render ---
    renderHomework();
});
