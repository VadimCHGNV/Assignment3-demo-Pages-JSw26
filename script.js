document.addEventListener('DOMContentLoaded', function() {
    // wait for full DOM parse before attaching listeners
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    // function to play a short ding sound using Audio API
    function playDing() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
             const oscillator = audioCtx.createOscillator();
             const gainNode = audioCtx.createGain();
             oscillator.connect(gainNode);
             gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = 880; // A5 note
            gainNode.gain.value = 0.2;
              oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
            oscillator.stop(audioCtx.currentTime + 0.5);
            // resume context if suspended 
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        } catch(e) {
            console.log('Web Audio API not supported');
        }
    }
    //function to update the task counter based on remaining unchecked tasks
     function updateCounter() {
        const items = document.querySelectorAll('.todo-item');
          let remaining = 0;
          items.forEach(item => {
            const cb = item.querySelector('input[type="checkbox"]');
            if (cb && !cb.checked) remaining++;
          }
    );
        const counterDiv = document.getElementById('task-counter');
      
        if (counterDiv) counterDiv.textContent = `Tasks left: ${remaining}`;
      }
 
      function deleteTodoItem(button) {
      // find parent li of the clicked delete button and remove it from dom
    const li = button.parentElement;
      li.classList.add('delete-animation');
      li.addEventListener('transitionend', function() {
        li.remove();
         updateCounter();
          }, 
      { once: true 

      });
}

    function handleCheckboxChange(checkbox, li) {
        // get the text span inside this li
        const span = li.querySelector('.todo-text');
      if (checkbox.checked) {
       span.classList.add('completed');
           playDing();
          // add green flash animation
            li.classList.add('check-animation');
               setTimeout(() => li.classList.remove('check-animation'), 300);
         todoList.appendChild(li);
          updateCounter();
         } 
            else {
            // remove completed class when unchecked
            span.classList.remove('completed');
             updateCounter();
        }
    }

    function addTodo() {
        const taskText = todoInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        // create new list item element
        const li = document.createElement('li');
        li.className = 'todo-item';

           // create checkbox for task completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function() {
            handleCheckboxChange(checkbox, li);
        });

           // create span to hold task text
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = taskText;

          // create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';

        // attach click listener to delete button
        deleteBtn.addEventListener('click', function() {
            deleteTodoItem(deleteBtn);
        });

        // append elements to li in order
        li.appendChild(checkbox);
         li.appendChild(span);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);

        todoInput.value = '';
         updateCounter();
    }

    addBtn.addEventListener('click', addTodo);

    // allow adding via enter key on input
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTodo(); });
});