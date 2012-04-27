Idle Timer for ExtJs 4
=============================

Inspired by [Idle Timer](http://yuilibrary.com/gallery/show/idletimer) for YUI by Nicolas Zakas.

## Installation
Copy source files to your project, use `Ext.require()` to use it in your application.

## Usage
Create `Utils.IdleTimer` object and use `start()` function to start timer. Assign `idle` and/or `active` listeners to perform actions when timer went into idle or active state.

```javascript
var timer = Ext.create('Utils.IdleTimer', {
    timeout: 10000,
    listeners: {
        idle: function(){
            console.log('Application went into idle state');
        },
        active: function(){
            console.log('Application went into active state');
        }
    }
});

timer.start();
```


