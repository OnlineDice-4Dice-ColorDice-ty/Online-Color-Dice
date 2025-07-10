    const diceElements = document.querySelectorAll('.dice');
    const colorButtons = document.querySelectorAll('.color-button');
    const rollAgainImg = document.querySelector('.roll-button-img');
    const diceContainer = document.querySelector('.dice-container');
    const topImage = document.querySelector('.top-image');
    const videoWrapper = document.getElementById('video-wrapper');
    const video = document.getElementById('roll-video');
    const rollSound = document.getElementById('roll-sound');

    const allColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

    function shuffle(array) {
      let currentIndex = array.length, randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    }

    function rollDiceExclude(excludeColor = null) {
      const availableColors = allColors.filter(color => color !== excludeColor);
      const chance = Math.random();
      let selectedColors = [];

      if (chance <= 0.05) {
        const duplicateColor = availableColors[Math.floor(Math.random() * availableColors.length)];
        const howManySame = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < howManySame; i++) {
          selectedColors.push(duplicateColor);
        }
        const rest = shuffle(availableColors.filter(c => c !== duplicateColor)).slice(0, 4 - howManySame);
        selectedColors = selectedColors.concat(rest);
      } else {
        selectedColors = shuffle(availableColors).slice(0, 4);
      }

      selectedColors = shuffle(selectedColors);
      diceElements.forEach((dice, index) => {
        dice.className = 'dice ' + selectedColors[index];
      });
    }

    function rollDiceAllUnique() {
      const shuffled = shuffle([...allColors]).slice(0, 4);
      diceElements.forEach((dice, index) => {
        dice.className = 'dice ' + shuffled[index];
      });
    }

    function playVideoThenRoll(excludeColor = null, forceUnique = false) {
      diceContainer.style.display = 'none';
      topImage.style.display = 'none';

      rollSound.currentTime = 0;
      rollSound.play();

      const videoFiles = ['images/1.mp4', 'images/2.mp4', 'images/3.mp4'];
      const selectedVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];

      video.innerHTML = `<source src="${selectedVideo}" type="video/mp4">`;
      video.load();
      videoWrapper.style.display = 'flex';
      video.currentTime = 0;
      video.play();

      video.onended = () => {
        videoWrapper.style.display = 'none';
        diceContainer.style.display = 'block';
        topImage.style.display = 'block';

        if (forceUnique) {
          rollDiceAllUnique();
        } else {
          rollDiceExclude(excludeColor);
        }
      };
    }

    colorButtons.forEach(button => {
      button.addEventListener('click', () => {
        const excludedColor = button.getAttribute('data-color');
        playVideoThenRoll(excludedColor, false);
      });
    });

    rollAgainImg.addEventListener('click', () => {
      playVideoThenRoll(null, true);
    });