import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  group,
} from '@angular/animations';

export const divStateAnimation = trigger('divState', [
  state(
    'normal',
    style({
      backgroundColor: 'red',
      transform: 'translateX(0)',
    })
  ),
  state(
    'highlighted',
    style({
      backgroundColor: 'blue',
      transform: 'translateX(100px)',
    })
  ),
  transition('normal <=> highlighted', animate(300)),
]);

export const wildStateAnimation = trigger('wildState', [
  state(
    'normal',
    style({
      backgroundColor: 'red',
      transform: 'translateX(0) scale(1)',
    })
  ),
  state(
    'highlighted',
    style({
      backgroundColor: 'blue',
      transform: 'translateX(100px) scale(1)',
    })
  ),
  state(
    'shrunken',
    style({
      backgroundColor: 'green',
      transform: 'translateX(0px) scale(0.5)',
    })
  ),
  transition('normal => highlighted', animate(300)),
  transition('highlighted => normal', animate(800)),
  transition('shrunken <=> *', [
    style({
      backgroundColor: 'orange',
    }),
    animate(
      300,
      style({
        borderRadius: '50px',
      })
    ),
    animate(500),
  ]),
]);

export const recipesAdd = trigger('recipesAdd', [
  state(
    'in',
    style({
      transform: 'translateX(0)',
      opacity: 1,
    })
  ),
  transition('void => *', [
    style({
      opacity: 0,
      transform: 'translateX(-100px)',
    }),
    animate(500),
  ]),
  transition('* => void', [
    animate(
      500,
      style({
        transform: 'translateX(100px)',
        opacity: 0,
      })
    ),
  ]),
]);

export const recipesAdd2 = trigger('recipesAdd2', [
  state(
    'in',
    style({
      transform: 'translateX(0)',
      opacity: 1,
    })
  ),
  transition('void => *', [
    animate(
      1000,
      keyframes([
        style({
          transform: 'translateX(-100px)',
          opacity: 0,
          offset: 0,
        }),
        style({
          transform: 'translateX(-50px)',
          opacity: 0.5,
          offset: 0.3,
        }),
        style({
          transform: 'translateX(-20px)',
          opacity: 1,
          offset: 0.8,
        }),
        style({
          transform: 'translateX(0px)',
          opacity: 1,
          offset: 1,
        }),
      ])
    ),
  ]),
  transition('* => void', [
    group([
      animate(
        300,
        style({
          color: 'red',
        })
      ),
      animate(
        800,
        style({
          transform: 'translateX(100px)',
          opacity: 0,
        })
      ),
    ]),
  ]),
]);

//void reserved state name
