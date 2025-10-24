document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const modal = document.getElementById('homework-modal');
    const closeButton = document.querySelector('.close-button');
    const homeworkList = document.querySelector('.homework-list');
    let activeHomeworkId = null;
    let activeContext = 'School'; // Default context

    // --- Data ---
    const allHomework = {
        'School': [
            {
                id: 'hw1',
                title: 'Maths Assignment',
                description: 'Chapter 5, exercises 1-10',
                dueDate: 'Oct 26',
                completed: false,
                comments: ['This looks tough!', 'I need help with question 5.'],
                reactions: ['👍', '😮'],
                image: 'https://via.placeholder.com/150',
                uploadTime: '10:30 AM',
            },
            {
                id: 'hw2',
                title: 'History Essay',
                description: 'The French Revolution',
                dueDate: 'Oct 28',
                completed: true,
                comments: [],
                reactions: ['💯'],
                image: 'https://via.placeholder.com/150',
                uploadTime: '1:00 PM',
            },
        ],
        'Math Club': [
            {
                id: 'mc1',
                title: 'Calculus Problems',
                description: 'Solve the attached worksheet.',
                dueDate: 'Oct 29',
                completed: false,
                comments: [],
                reactions: [],
                image: 'https://via.placeholder.com/150',
                uploadTime: '3:45 PM',
            },
        ],
        'Night School': [
            {
                id: 'ns1',
                title: 'Creative Writing',
                description: 'Write a short story (500 words).',
                dueDate: 'Nov 05',
                completed: false,
                comments: [],
                reactions: [],
                image: 'https://via.placeholder.com/150',
                uploadTime: '8:15 PM',
            },
        ]
    };

    // --- Render Function ---
    const renderHomework = () => {
        console.log(`Rendering homework for context: "${activeContext}"`);
        const homeworkData = allHomework[activeContext];
        if (!homeworkData) {
            console.error('No data found for this context!');
            return;
        }
        console.log(`Found ${homeworkData.length} items to render.`);

        // Fade out
        homeworkList.style.opacity = 0;

        setTimeout(() => {
            homeworkList.innerHTML = ''; // Clear existing items
            homeworkData.forEach((item, index) => {
            const homeworkItem = document.createElement('div');
            homeworkItem.style.animation = `stagger-in 0.5s ${index * 0.1}s both`;
            homeworkItem.className = `homework-item ${item.completed ? 'completed' : ''}`;
            homeworkItem.dataset.id = item.id;

            homeworkItem.innerHTML = `
                <div class="homework-pill">
                    <span class="due-date">${item.dueDate}</span>
                    <div class="completed-label">Completed</div>
                    <div class="checkbox-container">
                        <input type="checkbox" id="${item.id}" name="${item.id}" ${item.completed ? 'checked' : ''}>
                        <label for="${item.id}"></label>
                    </div>
                </div>
                <div class="homework-content">
                    <div class="homework-details">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                    <img src="${item.image}" alt="${item.title}" class="homework-image">
                </div>
                <span class="upload-time">${item.uploadTime}</span>
            `;
            homeworkList.appendChild(homeworkItem);
            });
            // Fade in
            homeworkList.style.opacity = 1;
            setupCheckboxListeners();
        }, 300); // Wait for fade out to complete
    };

    const setupCheckboxListeners = () => {
        const checkboxes = homeworkList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const homeworkItem = e.target.closest('.homework-item');
                const clickedItemId = homeworkItem.dataset.id;
                const homework = allHomework[activeContext].find(item => item.id === clickedItemId);

                homework.completed = e.target.checked;
                homeworkItem.classList.toggle('completed', e.target.checked);
            });
        });
    };

    // --- Event Delegation for Homework List ---
    homeworkList.addEventListener('click', (e) => {
        const homeworkItem = e.target.closest('.homework-item');
        if (!homeworkItem) return;

        const clickedItemId = homeworkItem.dataset.id;
        const homework = allHomework[activeContext].find(item => item.id === clickedItemId);

        // Prevent modal from opening if a checkbox was clicked
        if (e.target.closest('.checkbox-container')) {
            return;
        }

        // Open modal for other clicks on the item
        activeHomeworkId = clickedItemId;
        document.getElementById('modal-title').textContent = homework.title;
        document.getElementById('modal-description').textContent = homework.description;

        // Set the download link
        const downloadLink = document.getElementById('download-link');
        downloadLink.href = homework.image;
        downloadLink.download = `homework-${homework.id}.jpg`;

        // Render comments and reactions
        renderComments(homework.comments);
        renderReactions(homework.reactions);

        modal.style.display = 'block';
    });


    // --- Other Event Listeners ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    const dropzone = document.getElementById('dropzone');
    const fileUpload = document.getElementById('file-upload');
    const addHomeworkModal = document.getElementById('add-homework-modal');
    const addHomeworkForm = document.getElementById('add-homework-form');

    dropzone.addEventListener('click', () => fileUpload.click());

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            fileUpload.files = e.dataTransfer.files;
            addHomeworkModal.style.display = 'block';
        }
    });

    fileUpload.addEventListener('change', () => {
        if (fileUpload.files.length > 0) {
            addHomeworkModal.style.display = 'block';
        }
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    };

    addHomeworkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newHomework = {
            id: `hw${Date.now()}`,
            title: document.getElementById('new-homework-title').value,
            description: document.getElementById('new-homework-description').value,
            dueDate: formatDate(document.getElementById('new-homework-due-date').value),
            completed: false,
            comments: [],
            reactions: [],
            image: URL.createObjectURL(fileUpload.files[0]),
            uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        allHomework[activeContext].push(newHomework);
        renderHomework();
        addHomeworkModal.style.display = 'none';
        addHomeworkForm.reset();
    });

    addHomeworkModal.querySelector('.close-button').addEventListener('click', () => {
        addHomeworkModal.style.display = 'none';
    });

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
            const homework = allHomework[activeContext].find(item => item.id === activeHomeworkId);
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
                const homework = allHomework[activeContext].find(item => item.id === activeHomeworkId);
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

    // --- View & Context Switching ---
    const navLinks = document.querySelectorAll('.classes-nav a');
    const homeworkView = document.getElementById('homework-view');
    const profileView = document.getElementById('profile-view');
    const profileBtn = document.getElementById('profile-btn');
    const profileForm = document.getElementById('profile-form');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('--- Nav link clicked ---');

            // Switch to homework view if on profile page
            profileView.style.display = 'none';
            homeworkView.style.display = 'block';

            // Switch context
            const span = e.currentTarget.querySelector('span');
            if (span) {
                activeContext = span.textContent;
                console.log('New context set:', activeContext);
            } else {
                console.error('Could not find span in nav link!');
            }

            navLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');

            renderHomework();
        });
    });

    profileBtn.addEventListener('click', () => {
        homeworkView.style.display = 'none';
        profileView.style.display = 'block';
        navLinks.forEach(l => l.classList.remove('active')); // De-select nav items
    });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Profile changes saved!');
    });


    // --- Refraction Effect ---
    navLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            link.style.setProperty('--x', `${x}px`);
            link.style.setProperty('--y', `${y}px`);
        });
    });

    // --- Initial Render ---
    renderHomework();
    navLinks[0].classList.add('active'); // Set default active link
});
