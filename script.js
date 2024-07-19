document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-habit').addEventListener('click', addHabit);
    document.querySelector('.toggle-switch .checkbox').addEventListener('change', toggleDarkMode);
    loadHabits();
    showQuotesSequentially();
    setInterval(showQuotesSequentially, 6000); // Perbarui quote setiap 6 detik
    resetCompletionStatus();
    requestNotificationPermission();
    setDailyReminder();

    function addHabit() {
        const habitInput = document.getElementById('habit-input');
        const habitText = habitInput.value.trim();

        if (habitText === '') return;

        const habitList = document.getElementById('habit-list');

        const habitItem = document.createElement('li');
        habitItem.classList.add('task-item');

        const habitSpan = document.createElement('span');
        habitSpan.textContent = habitText;

        const completeButton = document.createElement('input');
        completeButton.type = 'checkbox';
        completeButton.classList.add('complete-btn');
        completeButton.addEventListener('change', function() {
            habitSpan.classList.toggle('complete', completeButton.checked);
            saveHabits();
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = `<svg class="delete-svgIcon" viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
        </svg>`;
        deleteButton.addEventListener('click', function() {
            habitList.removeChild(habitItem);
            saveHabits();
        });

        habitItem.appendChild(completeButton);
        habitItem.appendChild(habitSpan);
        habitItem.appendChild(deleteButton);

        habitList.appendChild(habitItem);

        habitInput.value = '';
        saveHabits();
    }

    function saveHabits() {
        const habits = [];
        document.querySelectorAll('#habit-list .task-item').forEach(item => {
            habits.push({
                text: item.querySelector('span').textContent,
                complete: item.querySelector('.complete-btn').checked
            });
        });
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    function loadHabits() {
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        habits.forEach(habit => {
            const habitList = document.getElementById('habit-list');

            const habitItem = document.createElement('li');
            habitItem.classList.add('task-item');

            const habitSpan = document.createElement('span');
            habitSpan.textContent = habit.text;
            if (habit.complete) {
                habitSpan.classList.add('complete');
            }

            const completeButton = document.createElement('input');
            completeButton.type = 'checkbox';
            completeButton.classList.add('complete-btn');
            completeButton.checked = habit.complete;
            completeButton.addEventListener('change', function() {
                habitSpan.classList.toggle('complete', completeButton.checked);
                saveHabits();
            });

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.innerHTML = `<svg class="delete-svgIcon" viewBox="0 0 448 512">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
            </svg>`;
            deleteButton.addEventListener('click', function() {
                habitList.removeChild(habitItem);
                saveHabits();
            });

            habitItem.appendChild(completeButton);
            habitItem.appendChild(habitSpan);
            habitItem.appendChild(deleteButton);

            habitList.appendChild(habitItem);
        });
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            localStorage.removeItem('dark-mode');
        }
    }

    function showQuotesSequentially() {
        const quotes = [
            { text: "Start your day with a good habit, it's like coffee for your soul", author: "" },
            { text: "Your habit will determine your future.", author: "Jack Canfield" },
            { text: "I'am back with new habit new me.", author: "Gwooday" },
            { text: "Kebiasaan berubah menjadi karakter.", author: "Ovid" },
            { text: "Set goals lu dan biarkan kebiasaan bawa lu ke sana.", author: "" },
            { text: "Building a new world and a new era with good habits to changes your life.", author: "Gwooday" },
            { text: "Kebiasaan baik itu investment jangka panjang for your future", author: "" },
            { text: "Be disciplined, guys. Kebiasaan baik gak bisa instan.", author: "" },
            { text: "Kebiasaan baik bakal ngebentuk lu jadi versi terbaik dari diri lu.", author: "" },
            { text: "Mulai dari yang kecil, because small steps lead to big changes.", author: "" },
            { text: "Manusia pada hakikatnya bukan apa apa tanpa adanya yang maha kuasa.", author: "Gwooday" },
        ];

        let quoteIndex = 0;
        const quoteElement = document.getElementById('quote-text');
        const authorElement = document.getElementById('quote-author');

        function displayQuote() {
            const quote = quotes[quoteIndex];
            quoteElement.textContent = quote.text;
            authorElement.textContent = quote.author ? ` -${quote.author}-` : '';
        }

        displayQuote();
        setInterval(() => {
            quoteIndex = (quoteIndex + 1) % quotes.length;
            displayQuote();
        }, 6000); // Berganti quote setiap 6 detik
    }

    function resetCompletionStatus() {
        const now = new Date();
        const lastResetDate = localStorage.getItem('last-reset-date');
        const lastReset = lastResetDate ? new Date(lastResetDate) : null;

        if (!lastReset || now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            document.querySelectorAll('#habit-list .task-item .complete-btn').forEach(button => {
                button.checked = false;
                button.closest('.task-item').querySelector('span').classList.remove('complete');
            });
            saveHabits();
            localStorage.setItem('last-reset-date', now.toISOString());
        }
    }

    function requestNotificationPermission() {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    function setDailyReminder() {
        if (Notification.permission === 'granted') {
            const now = new Date();
            const nextReminder = new Date();
            nextReminder.setHours(9, 0, 0, 0); // Waktu pengingat pada jam 9 pagi

            if (now > nextReminder) {
                nextReminder.setDate(nextReminder.getDate() + 1);
            }

            const timeout = nextReminder.getTime() - now.getTime();
            setTimeout(() => {
                new Notification("Jangan lupa lakuin plan harian lu!", {
                    body: "Selesaikan plan harian dan tetap semangat!",
                });
                setDailyReminder(); // Set pengingat
            }, timeout);
        }
    }
});
