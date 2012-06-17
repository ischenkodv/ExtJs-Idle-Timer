/**
 * Class that checks if user is idle.
 */
Ext.define('Utils.IdleTimer', {
    alias: 'utils.idle_timer',
    mixins: {
        observable: 'Ext.util.Observable'
    },

    config: {
        //the amount of time (ms) before the user is considered idle
        timeout: 30000
    },

    idle: false,           // indicates if the user is idle
    tId: -1,               // timeout ID
    enabled: false,        // indicates if the idle timer is enabled

    constructor: function(config){

        config = config || {};

        var me = this;
        me.addEvents(
            'start',
            'stop',
            'idle',
            'active'
        );

        me.mixins.observable.constructor.call(me);

        if (config.listeners) {
            me.on(config.listeners);
            delete config.listeners;
        }

        me.initConfig(config);
    },

    destroy: function(){
        this.clearListeners();
    },

    isRunning: function(){
        return this.enabled;
    },

    /**
     * Indicates if the user is idle or not.
     * @return {boolean} True if the user is idle, false if not.
     */
    isIdle: function(){
        return this.idle;
    },

    /**
     * Starts the idle timer. This adds appropriate event handlers
     * and starts the first timeout.
     * @param {int} timeout (Optional) A new value for the timeout period in ms.
     * @return {void}
     * @static
     */
    start: function(timeout){

        var me = this;

        me.enabled = true;
        me.idle = false;

        if (Ext.typeOf(timeout) == "number"){
            me.setTimeout(timeout);
        }

        //assign appropriate event handlers
        Ext.getDoc().on({
            mousemove: me.handleUserEvent,
            keydown: me.handleUserEvent,
            scope: me
        });

        //set a timeout to toggle state
        me.tId = Ext.Function.defer(me.toggleIdleState, me.getTimeout(), me);
    },

    /**
     * Stops the idle timer. This removes appropriate event handlers
     * and cancels any pending timeouts.
     * @return {void}
     */
    stop: function(){
        var me = this;

        me.enabled = false;
        clearTimeout(me.tId);

        //detach the event handlers
        Ext.getDoc().un({
            mousemove: me.handleUserEvent,
            keydown: me.handleUserEvent
        });
    },


    handleUserEvent: function(event){
        var me = this;

        clearTimeout(me.tId);

        if (me.enabled){

            if (me.idle) {

                // Bugfix: We have to skip several mousemove events because when we
                // show idle screen, somehouse mousemove event emitted.
                if (event.type == 'mousemove' && me.activeSwitchCounter < 5) {
                    me.activeSwitchCounter++;
                    return;
                }
                me.activeSwitchCounter = 0;

                me.toggleIdleState();
            }

            me.tId = Ext.Function.defer(me.toggleIdleState, me.getTimeout(), me);
        }
    },

    toggleIdleState: function(){
        this.idle = !this.idle;
        this.fireEvent(this.idle ? 'idle' : 'active');
    }
});
