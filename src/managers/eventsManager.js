// // class EventsManager {
// //   //TODO: смотреть стр 76 для бинда клавиш
// //   constructor() {
// //     this.bind = {}
// //     this.action = {
// //       'up': false,
// //       'left': false,
// //       'down': false,
// //       'right': false,
// //       'attack': false,
// //     };
// //     this.bind[87] = 'up'; // w
// //     this.bind[65] = 'left'; // a
// //     this.bind[83] = 'down'; // s
// //     this.bind[68] = 'right'; // d
// //     this.bind[32] = 'attack'; // space
//
// //     // TODO: возможно здесь необходимо использовать window
// //     window.addEventListener('keyown', this.onKeyDown);
// //     window.addEventListener('keyup', this.onKeyUp);
// //   }
//
// //   // handleMouseClick(event) {
// //   //     console.log('Вы нажали на элемент:', event.target)
// //   // }
//
// //   onKeyDown(event) {
// //     // gameManager.player.position.x += 10;
// //     // const action = this.action.bind[event.keyCode];
// //     // if (action) { // Если такое действие зарегестрировано
// //       // this.action[action] = true; // Фиксируем что происходит дейтсиве
// //       // console.log('Нажатие')
// //       // gameManager.player.position.x += 100;
// //       // Отрисовываем действие
// //     }
// //   }
//
// //   // onKeyUp(event) {
// //   //   // const action = this.action.bind[event.keyCode];
// //   //   // if (action) {
// //   //     // this.action[action] = true;
// //   //   // }
// //   // }
// // }
//
// // const eventsManager = new EventsManager();
//
// class EventsManager {
//   constructor() {
//     keys = {
//       w: {
//         pressed: false
//       },
//       a: {
//         pressed: false
//       },
//       s: {
//         pressed: false,
//       },
//       d: {
//         pressed: false
//       }
//     }
//
//     window.addEventListener('keyown', this.onKeyDown);
//     window.addEventListener('keyup', this.onKeyUp);
//   }
//
//   onKeyDown(event) {
//     console.log('Нажатие');
//     switch(event.key) {
//       case 'w':
//         this.keys.w.pressed = true;
//         gameManager.player.direction = 'up';
//         // switchAnimation
//         break
//       case 'a':
//         this.keys.a.pressed = true;
//         gameManager.player.direction = 'left';
//         break
//       case 's':
//         this.keys.s.pressed = true;
//         gameManager.player.direction = 'down';
//         break
//       case 'd':
//         this.keys.d.pressed = true
//         gameManager.player.direction = 'right'
//         break
//       case ' ':
//         if (!this.keys.spacePressed) {
//           this.keys.spacePressed = true
//           gameManager.player.attack()
//           gameManager.player.switchAnimation(
//             gameManager.player.direction === 'right'
//               ? 'attackRight'
//               : 'attackLeft'
//           )
//         }
//       break
//     }
//
//   }
//
//   onKeyUp(event) {
//     console.log('Отпускание');
//   }
// }
//
// const eventsManager = new EventsManager();



class EventsManager {
  constructor() {
    this.keys = {
      w: { pressed: false},
      a: { pressed: false},
      s: { pressed: false},
      d: { pressed: false},
    };

    this.preventInput = false;

    // Обработчик событий
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyDown(event) {
    if (this.preventInput) return;
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
      this.keys[key].pressed = true;
    }
  }

  onKeyUp(event) {
    if (this.preventInput) return;
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 'a' || key === 's' || key === 'd') {
      this.keys[key].pressed = false;
    }
  }
}

const eventsManager = new EventsManager();