document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const sections = document.querySelectorAll('section');
    const borrowForm = document.getElementById('borrow-form');
    const bookDropdown = document.getElementById('borrow-book');
    const messageBox = document.getElementById('message-box');

    function showMessage(message, type) {
        if (!messageBox) return;

        messageBox.textContent = message;
        messageBox.className = `message-box message-${type}`;
        messageBox.style.display = 'block';

        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }

    // Fill book dropdown
    const bookElements = document.querySelectorAll('.book p');
    bookDropdown.innerHTML = '<option value="">Select a book</option>';

    bookElements.forEach(bookElement => {
        const bookName = bookElement.textContent.trim();

        if (bookName !== '') {
            const option = document.createElement('option');
            option.value = bookName;
            option.textContent = bookName;
            bookDropdown.appendChild(option);
        }
    });

    // Search books
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();

            sections.forEach(section => {
                const books = section.querySelectorAll('.book');
                let sectionVisible = false;

                books.forEach(book => {
                    const titleElement = book.querySelector('p');
                    if (!titleElement) return;

                    const bookTitle = titleElement.textContent.toLowerCase();

                    if (bookTitle.includes(query)) {
                        book.style.display = 'block';
                        sectionVisible = true;
                    } else {
                        book.style.display = 'none';
                    }
                });

                const sectionTitle = section.querySelector('.section-title');

                if (books.length > 0) {
                    section.style.display = sectionVisible ? 'block' : 'none';
                    if (sectionTitle) {
                        sectionTitle.style.display = sectionVisible ? 'block' : 'none';
                    }
                }
            });
        });
    }

    // Borrow form submit
    borrowForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('borrow-email').value;
        const name = document.getElementById('borrow-name').value;
        const bookTitle = document.getElementById('borrow-book').value;
        const dueDate = document.getElementById('due-date').value;

        if (!email || !name || !bookTitle || !dueDate) {
            showMessage('Please fill out all fields.', 'error');
            return;
        }

        fetch('http://127.0.0.1:5000/borrow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                book: bookTitle,
                due_date: dueDate
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then(data => {
            showMessage("You have successfully borrowed this book.", "success");
            borrowForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage(error.message, 'error');
        });
    });

        // When user clicks Borrow under a book, go to form and select that book
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('borrow-button')) {
            const bookCard = event.target.closest('.book');
            const bookTitle = bookCard.querySelector('p').textContent.trim();

            document.getElementById('borrow').scrollIntoView({
                behavior: 'smooth'
            });

            bookDropdown.value = bookTitle;
            document.getElementById('borrow-email').focus();
        }
    });
});