function dropDown(){
    document.addEventListener('DOMContentLoaded', function() {
        
        const menuButton = document.getElementById('menu-button');
        const dropdownMenu = document.querySelector('.absolute.right-0');
        dropdownMenu.classList.add('hidden');

        menuButton.addEventListener('click', function() {

            const expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
            menuButton.setAttribute('aria-expanded', !expanded);
            dropdownMenu.classList.toggle('hidden');
            //is windows is not select.html 
            if(window.location.pathname !== '/index.html'){
                const dropdownLinks = dropdownMenu.querySelectorAll('a');
                dropdownLinks.forEach(link => {
                    const urlParams = new URLSearchParams(window.location.search);
                    urlParams.set('order', link.textContent);
                    link.href = `${window.location.pathname}?${urlParams.toString()}`;
                });
            }
        });
      
        // Chiudi il menu quando si clicca fuori da esso
        document.addEventListener('click', function(event) {
          const isClickInside = dropdownMenu.contains(event.target) || menuButton.contains(event.target);
          if (!isClickInside) {
            menuButton.setAttribute('aria-expanded', 'false');
            dropdownMenu.classList.add('hidden');
          }
        });
      });


}

function generateAddRemoveButtons() {

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('relative', 'inline-block', 'text-left');

    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.classList.add('bg-green-500', 'text-white', 'px-3', 'py-1.5', 'rounded-md', 'mr-2');
    addButton.id = 'add';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('bg-red-500', 'text-white','px-3', 'py-1.5', 'rounded-md');
    removeButton.id = 'remove';
    
    buttonsContainer.appendChild(addButton);
    buttonsContainer.appendChild(removeButton);
    document.querySelector('#deck-name').insertAdjacentElement('afterend', buttonsContainer);
}

export {dropDown, generateAddRemoveButtons};